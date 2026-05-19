import type { Metadata } from "next";
import ServicesView from "./ServicesView";
import {
  JsonLd,
  breadcrumbSchema,
  faqSchema,
  serviceSchemas,
} from "@/components/JsonLd";

const DESCRIPTION =
  "Three ways to work with Greyform: custom websites, redesigns, and web applications. Bespoke design and development, built from scratch and performance-first. Lagos-based, working globally.";

const OG_ALT = "Greyform services — custom websites, redesigns, web applications.";

export const metadata: Metadata = {
  title: "Services",
  description: DESCRIPTION,
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services · Greyform",
    description: DESCRIPTION,
    url: "https://greyform.org/services",
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: OG_ALT },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Services · Greyform",
    description: DESCRIPTION,
    images: [{ url: "/opengraph-image", alt: OG_ALT }],
  },
};

const crumbs = breadcrumbSchema([
  { name: "Home", item: "https://greyform.org" },
  { name: "Services", item: "https://greyform.org/services" },
]);

// FAQs mirror real client questions. Keep the wording aligned with copy
// elsewhere on the page so Google considers the answers genuine.
const faqs = faqSchema([
  {
    question: "Where is Greyform based, and do you work with clients outside Nigeria?",
    answer:
      "Greyform is based in Lagos, Nigeria, and works with clients globally. Time zone is GMT+1; we run async-friendly and reply within 48 hours.",
  },
  {
    question: "How much does a website from Greyform cost?",
    answer:
      "Custom websites start from £1,500 (about ₦2.4M). Redesigns start from £900 (about ₦1.4M). Web applications are quoted on scope after a discovery session.",
  },
  {
    question: "How long does a project take?",
    answer:
      "Most marketing sites ship in three to six weeks from kickoff. Redesigns are typically faster. Larger product builds are scoped per engagement.",
  },
  {
    question: "Do you use templates or themes?",
    answer:
      "No. Every site is designed from a blank file and hand-coded on Next.js, TypeScript, and Tailwind. The result is yours, performant, and easy to maintain.",
  },
  {
    question: "Who actually does the work?",
    answer:
      "Chudi Ofoma — Greyform's founder and creative director — leads design and engineering on every project. You speak to the person building the site.",
  },
]);

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={[crumbs, faqs, ...serviceSchemas]} />
      <ServicesView />
    </>
  );
}
