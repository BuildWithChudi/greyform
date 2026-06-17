import type { Metadata } from "next";
import { isAdminSession } from "@/lib/admin-auth";
import { getSupabase, type InquiryRow } from "@/lib/supabase";
import LoginForm from "./LoginForm";
import AdminTable from "./AdminTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Hide the entire surface from search engines, sharing previews, archivers.
export const metadata: Metadata = {
  title: "Admin",
  description: "Greyform internal.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  openGraph: { images: [] },
  twitter: { images: [] },
  alternates: { canonical: undefined },
};

export default async function AdminPage() {
  if (!isAdminSession()) {
    return <LoginForm />;
  }

  const supabase = getSupabase();
  let inquiries: InquiryRow[] = [];
  let storageError: string | null = null;

  if (!supabase) {
    storageError =
      "Supabase isn't configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env.";
  } else {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      console.error("[admin] supabase select failed", error);
      storageError = "Couldn't read inquiries.";
    } else {
      inquiries = (data ?? []) as InquiryRow[];
    }
  }

  return <AdminTable inquiries={inquiries} storageError={storageError} />;
}
