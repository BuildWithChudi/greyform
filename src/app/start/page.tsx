import type { Metadata } from "next";
import StartForm from "./StartForm";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";

const DESCRIPTION =
  "Tell us about your project. Four short steps, two minutes. We reply within 48 hours with a clear next step. Greyform · Web design & development studio.";

const OG_ALT = "Start a project with Greyform. Four short steps, two minutes.";

export const metadata: Metadata = {
  title: "Start a Project",
  description: DESCRIPTION,
  alternates: { canonical: "/start" },
  openGraph: {
    title: "Start a Project · Greyform",
    description: DESCRIPTION,
    url: "https://greyform.org/start",
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: OG_ALT },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Start a Project · Greyform",
    description: DESCRIPTION,
    images: [{ url: "/opengraph-image", alt: OG_ALT }],
  },
};

const crumbs = breadcrumbSchema([
  { name: "Home", item: "https://greyform.org" },
  { name: "Start a Project", item: "https://greyform.org/start" },
]);

export default function StartPage() {
  return (
    <>
      <JsonLd data={crumbs} />
      <StartForm />
    </>
  );
}
