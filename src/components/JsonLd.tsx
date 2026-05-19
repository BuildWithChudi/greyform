/**
 * JSON-LD structured data primitives.
 *
 * Mount <JsonLd /> with one of the exported schema objects (or an array of them)
 * inside <head> via dangerouslySetInnerHTML — Next 14's App Router renders the
 * script tag exactly where placed.
 *
 * Profile URLs in `personSchema.sameAs` are placeholders. Update them with
 * Chudi's real profiles before Search Console verification.
 */

const SITE_URL = "https://greyform.org";
const EMAIL = "hello@greyform.org";

// TODO: confirm canonical personal profile URLs for Chudi.
const PERSON_SAME_AS = [
  "https://www.linkedin.com/in/chudiofoma",
  "https://github.com/ochudi",
  "https://x.com/chudiofoma",
];

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Greyform",
  alternateName: "Greyform (KeyPass Solutions)",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/android-chrome-512x512.png`,
    width: 512,
    height: 512,
  },
  image: `${SITE_URL}/opengraph-image`,
  description:
    "Greyform is a Lagos-based web design and development studio. We build distinctive, performant websites for businesses, schools, and creators. Working globally.",
  founder: {
    "@type": "Person",
    "@id": `${SITE_URL}/#chudi-ofoma`,
    name: "Chukwudi Ofoma",
    alternateName: "Chudi Ofoma",
    url: `${SITE_URL}/about`,
    sameAs: PERSON_SAME_AS,
  },
  foundingDate: "2026",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lagos",
    addressRegion: "Lagos",
    addressCountry: "NG",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: EMAIL,
    contactType: "customer support",
    areaServed: "Worldwide",
    availableLanguage: ["English"],
  },
  areaServed: "Worldwide",
  knowsAbout: [
    "Web design",
    "Web development",
    "Next.js",
    "Tailwind CSS",
    "Brand identity",
    "Search engine optimisation",
  ],
} as const;

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#chudi-ofoma`,
  name: "Chukwudi Ofoma",
  alternateName: "Chudi Ofoma",
  givenName: "Chukwudi",
  familyName: "Ofoma",
  url: `${SITE_URL}/about`,
  image: `${SITE_URL}/opengraph-image`,
  email: EMAIL,
  jobTitle: "Founder & Creative Director, Greyform",
  description:
    "Founder and Creative Director of Greyform, a Lagos web design and development studio. Part-time lecturer (CSC 102) at Pan-Atlantic University.",
  worksFor: {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Greyform",
    url: SITE_URL,
  },
  affiliation: {
    "@type": "CollegeOrUniversity",
    name: "Pan-Atlantic University",
    url: "https://pau.edu.ng",
  },
  homeLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Lagos",
      addressCountry: "NG",
    },
  },
  knowsAbout: [
    "Web design",
    "Web development",
    "Next.js",
    "TypeScript",
    "Brand identity",
    "Computer science education",
  ],
  sameAs: PERSON_SAME_AS,
} as const;

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Greyform",
  description:
    "Greyform · Web design & development from Lagos. Working globally.",
  inLanguage: "en",
  publisher: { "@id": `${SITE_URL}/#organization` },
} as const;

export function JsonLd({
  data,
}: {
  data: Readonly<Record<string, unknown>> | readonly Readonly<Record<string, unknown>>[];
}) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify of a controlled object — no user input — so safe.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
