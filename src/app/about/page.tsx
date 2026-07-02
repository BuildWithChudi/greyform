import type { Metadata } from "next";
import AboutView from "./AboutView";
import {
  JsonLd,
  breadcrumbSchema,
  personSchema,
} from "@/components/JsonLd";

const DESCRIPTION =
  "Greyform is a Lagos web design and development studio building distinctive, performant websites for businesses, schools, and creators. Founded and led by Chudi Ofoma. Working globally.";

const OG_ALT = "About Greyform, a Lagos web design and development studio.";

export const metadata: Metadata = {
  title: "About",
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About · Greyform",
    description: DESCRIPTION,
    url: "https://greyform.org/about",
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: OG_ALT },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About · Greyform",
    description: DESCRIPTION,
    images: [{ url: "/opengraph-image", alt: OG_ALT }],
  },
};

const crumbs = breadcrumbSchema([
  { name: "Home", item: "https://greyform.org" },
  { name: "About", item: "https://greyform.org/about" },
]);

export default function AboutPage() {
  return (
    <>
      <JsonLd data={[personSchema, crumbs]} />
      <AboutView />
    </>
  );
}
