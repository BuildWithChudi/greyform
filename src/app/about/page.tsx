import type { Metadata } from "next";
import AboutView from "./AboutView";
import { JsonLd, personSchema } from "@/components/JsonLd";

const DESCRIPTION =
  "Greyform is a Lagos web design and development studio building distinctive, performant websites for businesses, schools, and creators. Founded and led by Chudi Ofoma. Working globally.";

export const metadata: Metadata = {
  title: "About",
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About · Greyform",
    description: DESCRIPTION,
    url: "https://greyform.org/about",
  },
  twitter: { title: "About · Greyform", description: DESCRIPTION },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={personSchema} />
      <AboutView />
    </>
  );
}
