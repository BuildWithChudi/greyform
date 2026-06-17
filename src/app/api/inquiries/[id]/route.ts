import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { isAdminSession } from "@/lib/admin-auth";
import {
  INQUIRY_STATUSES,
  getSupabase,
  type InquiryRow,
} from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const patchSchema = z
  .object({
    status: z.enum(INQUIRY_STATUSES).optional(),
    notes: z.string().max(10_000).optional().nullable(),
  })
  .refine((v) => v.status !== undefined || v.notes !== undefined, {
    message: "Provide at least one of status or notes.",
  });

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminSession()) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  if (!UUID_RE.test(params.id)) {
    return NextResponse.json(
      { ok: false, error: "Invalid id." },
      { status: 400 }
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

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: "Storage isn't configured on the server." },
      { status: 503 }
    );
  }

  const patch: Partial<Pick<InquiryRow, "status" | "notes">> = {};
  if (parsed.data.status !== undefined) patch.status = parsed.data.status;
  if (parsed.data.notes !== undefined) patch.notes = parsed.data.notes ?? null;

  const { data, error } = await supabase
    .from("inquiries")
    .update(patch)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    console.error("[inquiries:PATCH] supabase error", error);
    return NextResponse.json(
      { ok: false, error: "Couldn't save the change." },
      { status: 502 }
    );
  }
  if (!data) {
    return NextResponse.json(
      { ok: false, error: "Not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, inquiry: data });
}
