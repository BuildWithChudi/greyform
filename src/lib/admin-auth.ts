import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";

/**
 * Tiny single-user admin session, signed cookie only. No DB, no JWT lib.
 *
 * Token format: `<ts>.<hex-hmac>` where the HMAC is keyed by the admin
 * password itself (env). Forging requires knowing the password; expiry is
 * encoded in the token, so logout = clear cookie.
 */

const COOKIE_NAME = "gf_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getPassword(): string | null {
  return process.env.ADMIN_PASSWORD || null;
}

function sign(ts: string, password: string): string {
  return crypto.createHmac("sha256", password).update(ts).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/**
 * Constant-time check of a submitted password against ADMIN_PASSWORD.
 */
export function verifyPassword(submitted: string): boolean {
  const expected = getPassword();
  if (!expected) return false;
  if (typeof submitted !== "string" || submitted.length === 0) return false;
  return safeEqual(submitted, expected);
}

/**
 * Issue a fresh token bound to the current ADMIN_PASSWORD.
 * If the password env changes, all outstanding tokens are silently invalidated.
 */
export function issueToken(): string | null {
  const pwd = getPassword();
  if (!pwd) return null;
  const ts = Date.now().toString();
  return `${ts}.${sign(ts, pwd)}`;
}

function parseToken(token: string): { ts: number; mac: string } | null {
  const dot = token.indexOf(".");
  if (dot <= 0 || dot === token.length - 1) return null;
  const tsStr = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const ts = Number(tsStr);
  if (!Number.isFinite(ts) || ts <= 0) return null;
  return { ts, mac };
}

export function verifyToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const pwd = getPassword();
  if (!pwd) return false;
  const parsed = parseToken(token);
  if (!parsed) return false;
  const ageMs = Date.now() - parsed.ts;
  if (ageMs < 0 || ageMs > MAX_AGE_SECONDS * 1000) return false;
  const expected = sign(parsed.ts.toString(), pwd);
  return safeEqual(parsed.mac, expected);
}

/* ─────────────────────────── cookie helpers ─────────────────────────── */

export function setAdminCookie(token: string) {
  cookies().set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export function clearAdminCookie() {
  cookies().set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export function isAdminSession(): boolean {
  const token = cookies().get(COOKIE_NAME)?.value;
  return verifyToken(token);
}
