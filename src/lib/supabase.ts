import "server-only";
import WebSocket from "ws";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the service-role key. Bypasses RLS by
 * design, so this MUST NOT be imported into a client component.
 *
 * `getSupabase()` returns null when env isn't configured — callers should
 * treat Supabase as best-effort and never block the user flow on it.
 */

let cached: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    cached = null;
    return null;
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    db: { schema: "public" },
    // We never use Realtime, but supabase-js v2.106 eagerly constructs a
    // RealtimeClient that demands a WebSocket implementation — which Node < 22
    // doesn't expose globally. Handing it `ws` satisfies that constructor so
    // the client builds on Node 20 (local + Vercel) without throwing.
    realtime: { transport: WebSocket as unknown as typeof globalThis.WebSocket },
  });
  return cached;
}

// Re-export the client-safe types for server callers that prefer one import.
export {
  INQUIRY_STATUSES,
  INQUIRY_STATUS_LABEL,
  type InquiryRow,
  type InquiryStatus,
} from "./inquiry-types";
