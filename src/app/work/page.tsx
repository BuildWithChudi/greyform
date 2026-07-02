import type { Metadata } from "next";
import WorkIndex from "./WorkIndex";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";

const DESCRIPTION =
  "Selected case studies from Greyform. Every site is live, in production, and built from scratch. Web design and development for businesses, schools, and creators.";

const OG_ALT = "Selected work from Greyform. Case studies.";

export const metadata: Metadata = {
  title: "Work",
  description: DESCRIPTION,
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Work · Greyform",
    description: DESCRIPTION,
    url: "https://greyform.org/work",
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: OG_ALT },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Work · Greyform",
    description: DESCRIPTION,
    images: [{ url: "/opengraph-image", alt: OG_ALT }],
  },
};

const crumbs = breadcrumbSchema([
  { name: "Home", item: "https://greyform.org" },
  { name: "Work", item: "https://greyform.org/work" },
]);

export default function WorkPage() {
  return (
    <>
      <JsonLd data={crumbs} />
      <WorkIndex />
    </>
  );
}
