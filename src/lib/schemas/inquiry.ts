import { z } from "zod";

export const PROJECT_TYPE_OPTIONS = [
  { value: "new-website", label: "New website" },
  { value: "redesign", label: "Redesign" },
  { value: "web-application", label: "Web application" },
  { value: "brand-website", label: "Brand + website" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const TIMELINE_OPTIONS = [
  { value: "asap", label: "ASAP" },
  { value: "1-2-months", label: "1–2 months" },
  { value: "3-6-months", label: "3–6 months" },
  { value: "flexible", label: "Flexible" },
] as const;

export const BUDGET_OPTIONS = [
  { value: "under-1k", label: "Under £1,000" },
  { value: "1k-3k", label: "£1,000 to £3,000" },
  { value: "3k-10k", label: "£3,000 to £10,000" },
  { value: "10k-plus", label: "£10,000+" },
  { value: "not-sure", label: "Not sure" },
] as const;

export const inquirySchema = z.object({
  projectType: z.enum(
    [
      "new-website",
      "redesign",
      "web-application",
      "brand-website",
      "not-sure",
    ],
    { message: "Pick the option that fits closest." }
  ),
  description: z
    .string()
    .trim()
    .min(20, "A few sentences helps us give you a real answer.")
    .max(5000, "Let's keep it under 5,000 characters."),
  references: z.string().trim().max(2000).optional().or(z.literal("")),
  timeline: z.enum(["asap", "1-2-months", "3-6-months", "flexible"], {
    message: "Pick a timeline.",
  }),
  budget: z.enum(
    ["under-1k", "1k-3k", "3k-10k", "10k-plus", "not-sure"],
    { message: "Pick a budget." }
  ),
  name: z.string().trim().min(1, "Your name?").max(120),
  email: z
    .string()
    .trim()
    .min(1, "We'll need an email to reply.")
    .email("That doesn't look like a valid email."),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  location: z.string().trim().max(120).optional().or(z.literal("")),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

type ReadonlyOption = { readonly value: string; readonly label: string };

export function labelOf(
  options: readonly ReadonlyOption[],
  value: string | undefined
): string {
  if (!value) return "";
  return options.find((o) => o.value === value)?.label ?? value;
}
