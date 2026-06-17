import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import {
  BUDGET_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  TIMELINE_OPTIONS,
  inquirySchema,
  labelOf,
} from "@/lib/schemas/inquiry";
import { InquiryEmail } from "@/emails/InquiryEmail";
import { ConfirmationEmail } from "@/emails/ConfirmationEmail";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

// Simple per-IP token bucket. Survives within a single warm serverless
// instance; on Vercel that's enough to slow opportunistic spam. For higher
// guarantees, swap for an Upstash Redis or @vercel/kv backed store.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 4;
const rateLimitBuckets = new Map<string, { count: number; reset: number }>();

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

function checkRateLimit(ip: string): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(ip);
  if (!bucket || bucket.reset < now) {
    rateLimitBuckets.set(ip, { count: 1, reset: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true };
  }
  if (bucket.count >= RATE_LIMIT_MAX) {
    return { ok: false, retryAfter: Math.ceil((bucket.reset - now) / 1000) };
  }
  bucket.count += 1;
  return { ok: true };
}

const MAX_PAYLOAD_BYTES = 16 * 1024;

function generateRef(): string {
  let out = "";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < 6; i++) {
    out += REF_ALPHABET[bytes[i] % REF_ALPHABET.length];
  }
  return out;
}

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const rl = checkRateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many requests. Try again in a minute, or email me directly.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfter) },
      }
    );
  }

  // Reject obviously oversized payloads before parsing JSON.
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > MAX_PAYLOAD_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Payload too large." },
      { status: 413 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const parsed = inquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Some fields need another look.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const inquiry = parsed.data;

  // Honeypot tripped — silently 200 so the bot thinks it succeeded.
  if (inquiry.website && inquiry.website.length > 0) {
    return NextResponse.json({ ok: true, ref: "OK" });
  }
  const ref = generateRef();
  const submittedAt = new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC";

  const projectTypeLabel = labelOf(PROJECT_TYPE_OPTIONS, inquiry.projectType);
  const timelineLabel = labelOf(TIMELINE_OPTIONS, inquiry.timeline);
  const budgetLabel = labelOf(BUDGET_OPTIONS, inquiry.budget);

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.INQUIRY_FROM_EMAIL ?? "Greyform <hello@greyform.org>";
  const to = process.env.INQUIRY_TO_EMAIL ?? "hello@greyform.org";

  if (!apiKey) {
    console.error("[inquiry] RESEND_API_KEY missing — cannot send.");
    return NextResponse.json(
      {
        ok: false,
        error: "The inquiry form is misconfigured. Email me directly at hello@greyform.org.",
      },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);

  try {
    const [notify, confirm] = await Promise.all([
      resend.emails.send({
        from,
        to,
        replyTo: inquiry.email,
        subject: `New inquiry · ${inquiry.name} · ${projectTypeLabel} · ${budgetLabel} [${ref}]`,
        react: InquiryEmail({
          ref,
          name: inquiry.name,
          email: inquiry.email,
          company: inquiry.company || undefined,
          location: inquiry.location || undefined,
          projectTypeLabel,
          timelineLabel,
          budgetLabel,
          description: inquiry.description,
          references: inquiry.references || undefined,
          submittedAt,
        }),
      }),
      resend.emails.send({
        from,
        to: inquiry.email,
        replyTo: to,
        subject: "Got it. Talk soon. · Greyform",
        react: ConfirmationEmail({
          ref,
          firstName: firstName(inquiry.name),
          name: inquiry.name,
          email: inquiry.email,
          company: inquiry.company || undefined,
          location: inquiry.location || undefined,
          projectTypeLabel,
          timelineLabel,
          budgetLabel,
          description: inquiry.description,
          references: inquiry.references || undefined,
          submittedAt,
        }),
        text: `Hi ${firstName(inquiry.name)},

Thanks for reaching out. We've got your inquiry and will reply within 48 hours.

Below is a copy of what you sent, in case it's useful for your records.

YOUR INQUIRY
From: ${inquiry.name}${inquiry.company ? ` (${inquiry.company})` : ""}
Email: ${inquiry.email}${inquiry.location ? `\nLocation: ${inquiry.location}` : ""}

Project type: ${projectTypeLabel}
Timeline: ${timelineLabel}
Budget: ${budgetLabel}

Description:
${inquiry.description}${inquiry.references ? `\n\nReferences:\n${inquiry.references}` : ""}

The Greyform team

(Ref: ${ref})`,
      }),
    ]);

    if (notify.error || confirm.error) {
      console.error("[inquiry] Resend reported error", {
        notify: notify.error,
        confirm: confirm.error,
      });
      return NextResponse.json(
        {
          ok: false,
          error: "Couldn't send right now. Try again in a moment, or email me directly.",
        },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("[inquiry] Resend threw", err);
    return NextResponse.json(
      {
        ok: false,
        error: "Couldn't send right now. Try again in a moment, or email me directly.",
      },
      { status: 502 }
    );
  }

  // Best-effort persistence to Supabase. We've already sent both emails, so a
  // DB failure here must not 5xx the user — surface it in logs only.
  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error: dbError } = await supabase.from("inquiries").insert({
        name: inquiry.name,
        email: inquiry.email,
        company: inquiry.company || null,
        location: inquiry.location || null,
        project_type: inquiry.projectType,
        description: inquiry.description,
        references: inquiry.references || null,
        timeline: inquiry.timeline,
        budget: inquiry.budget,
      });
      if (dbError) {
        console.error("[inquiry] Supabase insert failed", dbError);
      }
    } catch (err) {
      console.error("[inquiry] Supabase threw", err);
    }
  }

  return NextResponse.json({ ok: true, ref });
}
