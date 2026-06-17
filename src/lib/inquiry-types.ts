// Plain types & constants for inquiry rows. Safe to import from both server
// and client components — no Supabase SDK, no env access.

export type InquiryRow = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  location: string | null;
  project_type: string;
  description: string;
  references: string | null;
  timeline: string;
  budget: string;
  status: InquiryStatus;
  notes: string | null;
  created_at: string;
};

export const INQUIRY_STATUSES = [
  "new",
  "contacted",
  "proposal_sent",
  "won",
  "lost",
] as const;

export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const INQUIRY_STATUS_LABEL: Record<InquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  proposal_sent: "Proposal sent",
  won: "Won",
  lost: "Lost",
};
