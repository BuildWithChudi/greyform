export type Service = {
  slug: string;
  number: string;
  title: string;
  summary: string;        // 1–2 lines for the homepage row card
  description: string;    // longer paragraph for /services full block
  whatsIncluded: readonly string[];
  pricePreview: string;   // homepage card right column, e.g. "From £1,500"
  priceLabel: string;     // e.g. "Starting from" or "Pricing"
  priceDetail: string;    // e.g. "£1,500 / ₦2.4M" or "Quoted on scope"
  ctaLabel: string;
  ctaHref: string;
};

export const SERVICES: readonly Service[] = [
  {
    slug: "custom-websites",
    number: "01",
    title: "Custom Websites",
    summary:
      "Brand-built sites, from strategy through launch. Bespoke design, hand-coded, performance-first.",
    description:
      "A site built around your business and nobody else's. We start with what the site actually needs to do, shape the structure around the people you want it to reach, then design and build the whole thing from scratch. Fast, distinctive, easy for your team to keep current long after we hand over the keys.",
    whatsIncluded: [
      "Custom design. No templates. No theme buy-ins.",
      "Hand-coded development on Next.js and Tailwind",
      "Deployment and DNS setup (Vercel, or your host)",
      "Two structured rounds of revisions",
      "SEO foundations: sitemap, metadata, schema, OG",
      "Mobile, tablet, desktop. Polished, not just \"responsive\".",
    ],
    pricePreview: "From £1,500",
    priceLabel: "Starting from",
    priceDetail: "£1,500 / ₦2.4M",
    ctaLabel: "Start a website project",
    ctaHref: "/start",
  },
  {
    slug: "redesigns",
    number: "02",
    title: "Redesigns",
    summary:
      "A focused rework of a site you already have. Better speed, structure, and visual identity, without starting from zero.",
    description:
      "Best when the bones are there but the surface isn't pulling its weight. We audit what's working, decide what to keep, then redesign and rebuild the parts that don't earn their place. You ship a faster, sharper site without the cost or timeline of a full ground-up build.",
    whatsIncluded: [
      "Audit of content, structure, performance, identity",
      "Visual redesign with a refreshed type and colour system",
      "Rebuild on a modern, maintainable stack",
      "Performance and accessibility pass",
      "Two structured rounds of revisions",
      "Migration and deployment, with redirects mapped",
    ],
    pricePreview: "From £900",
    priceLabel: "Starting from",
    priceDetail: "£900 / ₦1.4M",
    ctaLabel: "Start a redesign",
    ctaHref: "/start",
  },
  {
    slug: "web-applications",
    number: "03",
    title: "Web Applications",
    summary:
      "Custom tools, dashboards, and product surfaces. From prototype to production, designed and engineered together.",
    description:
      "For when a marketing site isn't enough, and the product is the site. Internal tools, customer dashboards, booking flows, content systems. We scope, design, and build with the same craft as a marketing build, but with the engineering depth a real product needs.",
    whatsIncluded: [
      "Discovery and scoping session, written brief",
      "Design system tuned to the product surface",
      "Frontend in Next.js, backend on your stack of choice",
      "Authentication, integrations, data model design",
      "Staged deployment with environments and CI",
      "Optional ongoing engineering support, billed separately",
    ],
    pricePreview: "Quoted",
    priceLabel: "Pricing",
    priceDetail: "Quoted on scope",
    ctaLabel: "Request a quote",
    ctaHref: "/start",
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
