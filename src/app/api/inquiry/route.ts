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

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

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

  return NextResponse.json({ ok: true, ref });
}
