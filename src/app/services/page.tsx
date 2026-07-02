import type { Metadata } from "next";
import ServicesView from "./ServicesView";
import {
  JsonLd,
  breadcrumbSchema,
  faqSchema,
  serviceSchemas,
} from "@/components/JsonLd";
import { SERVICES_FAQS } from "@/data/faqs";

const DESCRIPTION =
  "Three ways to work with Greyform: custom websites, redesigns, and web applications. Bespoke design and development, built from scratch and performance-first. Lagos-based, working globally.";

const OG_ALT = "Greyform services: custom websites, redesigns, web applications.";

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

// FAQ JSON-LD and the visible FAQ section on /services share one data source,
// because Google only honours the FAQ rich result when the structured answer
// text appears verbatim on the page.
const faqs = faqSchema(SERVICES_FAQS);

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={[crumbs, faqs, ...serviceSchemas]} />
      <ServicesView />
    </>
  );
}
