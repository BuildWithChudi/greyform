import type { Metadata } from "next";
import WorkIndex from "./WorkIndex";

const DESCRIPTION =
  "Selected case studies from Greyform. Every site is live, in production, and built from scratch. Web design and development for businesses, schools, and creators.";

export const metadata: Metadata = {
  title: "Work",
  description: DESCRIPTION,
  alternates: { canonical: "/work" },
  openGraph: {
    title: "Work · Greyform",
    description: DESCRIPTION,
    url: "https://greyform.org/work",
  },
  twitter: { title: "Work · Greyform", description: DESCRIPTION },
};

export default function WorkPage() {
  return <WorkIndex />;
}
