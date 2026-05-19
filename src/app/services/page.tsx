import type { Metadata } from "next";
import ServicesView from "./ServicesView";

const DESCRIPTION =
  "Three ways to work with Greyform: custom websites, redesigns, and web applications. Bespoke design and development, built from scratch and performance-first. Lagos-based, working globally.";

export const metadata: Metadata = {
  title: "Services",
  description: DESCRIPTION,
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services · Greyform",
    description: DESCRIPTION,
    url: "https://greyform.org/services",
  },
  twitter: { title: "Services · Greyform", description: DESCRIPTION },
};

export default function ServicesPage() {
  return <ServicesView />;
}
