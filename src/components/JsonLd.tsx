/**
 * JSON-LD structured data primitives.
 *
 * The schema graph is intentionally cross-linked by @id so Google reads it as
 * one entity (Organization ↔ Founder Person ↔ Website ↔ Pages).
 *
 * Update PERSON_SAME_AS with Chudi's real, claimed profile URLs before
 * Search Console verification — wrong sameAs URLs weaken brand SERP.
 */

const SITE_URL = "https://greyform.org";
const EMAIL = "hello@greyform.org";
const LOGO_URL = `${SITE_URL}/android-chrome-512x512.png`;
const OG_URL = `${SITE_URL}/opengraph-image`;

// Public profile URLs for Chudi — the studio's identity is his identity.
// Replace any handle that isn't actually owned to keep E-E-A-T signals truthful.
const PERSON_SAME_AS = [
  "https://www.linkedin.com/in/ochudi",
  "https://github.com/ochudi",
  "https://x.com/mrofoma",
  "https://instagram.com/mrofoma",
];

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": `${SITE_URL}/#organization`,
  name: "Greyform",
  legalName: "Greyform (KeyPass Solutions)",
  alternateName: ["Greyform Studio", "Greyform Web Studio"],
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: LOGO_URL,
    width: 512,
    height: 512,
  },
  image: OG_URL,
  description:
    "Greyform is a Lagos-based web design and development studio. We build distinctive, performant websites for businesses, schools, and creators. Working globally.",
  slogan: "Websites that don't look like they were made by AI.",
  founder: { "@id": `${SITE_URL}/#chudi-ofoma` },
  foundingDate: "2026",
  numberOfEmployees: { "@type": "QuantitativeValue", value: 1 },
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
  email: EMAIL,
  areaServed: ["NG", "GB", "US", "Worldwide"],
  priceRange: "£££",
  knowsAbout: [
    "Web design",
    "Web development",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Brand identity",
    "Editorial design",
    "Search engine optimisation",
    "Web performance",
  ],
  sameAs: PERSON_SAME_AS,
  parentOrganization: {
    "@type": "Organization",
    name: "KeyPass Solutions",
  },
} as const;

export const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#chudi-ofoma`,
  name: "Chukwudi Ofoma",
  alternateName: ["Chudi Ofoma", "Chudi"],
  givenName: "Chukwudi",
  familyName: "Ofoma",
  url: `${SITE_URL}/about`,
  image: OG_URL,
  email: EMAIL,
  jobTitle: "Founder & Creative Director, Greyform",
  description:
    "Founder and Creative Director of Greyform, a Lagos web design and development studio. Part-time lecturer (CSC 102) at Pan-Atlantic University.",
  worksFor: { "@id": `${SITE_URL}/#organization` },
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
  alternateName: "Greyform Studio",
  description:
    "Greyform · Web design & development from Lagos. Working globally.",
  inLanguage: "en",
  publisher: { "@id": `${SITE_URL}/#organization` },
  // SearchAction lets Google show a sitelinks search box when ranking for
  // "greyform" — even if it never wires up on-site, it's a brand-SERP signal.
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/work?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
} as const;

/**
 * Service schema — surface the three offers as discrete services tied to the
 * Organization. Helps Google show service-ish rich results for branded queries.
 */
export const serviceSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/services#custom-websites`,
    serviceType: "Web design and development",
    name: "Custom Websites",
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: "Worldwide",
    description:
      "Bespoke marketing websites, designed and hand-coded from scratch on Next.js and Tailwind. Performance-first, editorial in feel, easy for your team to keep current.",
    url: `${SITE_URL}/services#custom-websites`,
    offers: {
      "@type": "Offer",
      priceCurrency: "GBP",
      price: "1500",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "GBP",
        minPrice: 1500,
      },
      availability: "https://schema.org/InStock",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/services#redesigns`,
    serviceType: "Website redesign",
    name: "Redesigns",
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: "Worldwide",
    description:
      "Focused rebuilds for sites that already exist but aren't pulling their weight. Audit, redesign, and rebuild on a modern, maintainable stack.",
    url: `${SITE_URL}/services#redesigns`,
    offers: {
      "@type": "Offer",
      priceCurrency: "GBP",
      price: "900",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "GBP",
        minPrice: 900,
      },
      availability: "https://schema.org/InStock",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/services#web-applications`,
    serviceType: "Web application design and engineering",
    name: "Web Applications",
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: "Worldwide",
    description:
      "Custom internal tools, customer dashboards, booking flows, and content systems. Designed and engineered together, prototype through production.",
    url: `${SITE_URL}/services#web-applications`,
  },
] as const;

/**
 * BreadcrumbList — Google uses this to render breadcrumbs in SERP results.
 * Pass an array of { name, item } where `item` is the absolute URL.
 */
export function breadcrumbSchema(
  trail: readonly { name: string; item: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: t.item,
    })),
  };
}

/**
 * FAQPage schema. Mount on /services or anywhere with a Q/A block — eligible
 * for FAQ rich results when content matches the visible page text.
 */
export function faqSchema(items: readonly { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: it.answer },
    })),
  };
}

export function caseStudySchema(args: {
  slug: string;
  client: string;
  title: string;
  summary: string;
  year: string;
  cover: string;
  liveUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${SITE_URL}/work/${args.slug}`,
    name: `${args.client} — ${args.title}`,
    headline: args.title,
    description: args.summary,
    url: `${SITE_URL}/work/${args.slug}`,
    image: args.cover,
    datePublished: `${args.year}-01-01`,
    creator: { "@id": `${SITE_URL}/#organization` },
    author: { "@id": `${SITE_URL}/#chudi-ofoma` },
    about: args.client,
    keywords: ["web design", "web development", "Greyform"],
    isBasedOn: args.liveUrl,
  };
}

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
