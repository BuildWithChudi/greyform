import { NextResponse, type NextRequest } from "next/server";
import {
  issueToken,
  setAdminCookie,
  verifyPassword,
} from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Per-IP throttle to slow down brute force. In-memory; resets per warm
// instance, which is enough for a single-admin surface.
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 5;
const buckets = new Map<string, { count: number; reset: number }>();

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  const now = Date.now();
  const b = buckets.get(ip);
  if (b && b.reset > now) {
    if (b.count >= MAX_ATTEMPTS) {
      return NextResponse.json(
        { ok: false, error: "Too many attempts. Try again in a minute." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil((b.reset - now) / 1000)) },
        }
      );
    }
    b.count += 1;
  } else {
    buckets.set(ip, { count: 1, reset: now + WINDOW_MS });
  }

  let body: { password?: unknown } | null = null;
  try {
    body = (await req.json()) as { password?: unknown };
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const submitted = typeof body?.password === "string" ? body.password : "";
  if (!verifyPassword(submitted)) {
    return NextResponse.json(
      { ok: false, error: "Wrong password." },
      { status: 401 }
    );
  }

  const token = issueToken();
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Admin is not configured on the server." },
      { status: 503 }
    );
  }

  setAdminCookie(token);
  // Reset the throttle on a successful login.
  buckets.delete(ip);
  return NextResponse.json({ ok: true });
}
