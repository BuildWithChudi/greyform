export type GalleryImage = {
  src: string;
  alt: string;
  caption?: string;
};

export type StatItem = {
  value: string;
  label: string;
};

export type Section = {
  heading: string;
  body: string;
  images?: readonly GalleryImage[];
};

export type Outcome = Section & {
  stats?: readonly StatItem[];
};

export type Testimonial = {
  quote: string;
  attribution: string;
};

export type CaseStudy = {
  // Index card
  slug: string;
  client: string;
  title: string;
  year: string;
  summary: string;
  tags: readonly string[];
  cover: string;
  coverAlt: string;
  liveUrl: string;
  liveUrlLabel: string; // Display string for the meta strip, e.g. "whitesandsschool.com"
  role: string;

  // Detail page
  timeline?: string;
  stack?: readonly string[];
  problem?: Section;
  approach?: Section;
  outcome?: Outcome;
  gallery?: readonly GalleryImage[];
  testimonial?: Testimonial;

  // Set `true` while the writeup or imagery isn't ready. Draft entries are
  // filtered out of every public list, route, and sitemap — flip to `false`
  // (or remove the field) to ship.
  draft?: boolean;
};

// Full set, including in-progress writeups. Kept private so draft entries
// never leak into a public list or sitemap by accident.
const ALL_CASE_STUDIES: readonly CaseStudy[] = [
  {
    slug: "whitesands",
    client: "Whitesands School",
    title: "A complete digital reset for a Lagos Catholic school.",
    year: "2026",
    summary:
      "Rebuilt admissions, parent comms, and the public face of a 600-pupil school from the ground up. The old site was slow and a year out of date. The new one is fast, editorial, and updated weekly by the people who actually run the school.",
    tags: ["Web Design", "Development", "SEO", "Brand"],
    cover:
      "https://ik.imagekit.io/chewdee/greyform/greyform/whitesands-site.png",
    coverAlt: "Whitesands School website by Greyform",
    liveUrl: "https://whitesandsschool.com",
    liveUrlLabel: "whitesandsschool.com",
    role: "Design + Development",
    timeline: "6 weeks",
    stack: ["Next.js", "Tailwind", "Vercel"],
    problem: {
      heading: "A school site that worked against the school.",
      body: "Whitesands had outgrown its previous site. Pages were slow, admissions funnelled parents through a confusing PDF, and the homepage hadn't been touched in years. Staff couldn't make updates without external help, so it stayed frozen, and started reading as out-of-date to the families it needed to reach.",
    },
    approach: {
      heading: "Strip it back, then rebuild around how the school actually works.",
      body: "We started with a content audit. What does a parent, a prospective family, and a staff member each need to find inside of ten seconds? That answer shaped the structure (admissions, life on campus, calendar, contact) before a single screen was designed. From there, an editorial layout system using Fraunces for headings and a confident, restrained palette. Hand-built in Next.js on Vercel for speed, with a small CMS surface so the front office can publish announcements and term-letters without touching code.",
    },
    outcome: {
      heading: "Faster, fuller, and the school can drive it.",
      body: "Page-load time dropped substantially across the site, admissions inquiries became a single guided form, and the site now ranks for queries it never reached before. The part that matters most: staff push updates themselves, weekly, without any handoff.",
      stats: [
        { value: "+220%", label: "Page speed" },
        { value: "96", label: "Lighthouse" },
        { value: "4 → 12", label: "Pages" },
      ],
    },
    // Drop the real quote and attribution here once you have it from the
    // principal or comms lead — the rendering in CaseStudyView and the
    // homepage TestimonialStrip light up automatically.
    // testimonial: {
    //   quote: "Greyform took our admissions site from a liability to the part of the school we're proudest to show parents.",
    //   attribution: "Mrs. <Name>, Principal · Whitesands School",
    // },
  },
  {
    slug: "ipheclan",
    client: "Iphe / Ipheclan",
    title: "Personal brand site for a 4M+ TikTok creator.",
    year: "2026",
    summary:
      "A single-page identity site for one of Nigeria's most-followed lifestyle creators. Confident, slow-scrolling editorial layout. Press-ready bio. A booking flow that doesn't feel like a form.",
    tags: ["Web Design", "Development", "Personal Brand"],
    cover: "https://ik.imagekit.io/chewdee/greyform/greyform/iphe-site.png",
    coverAlt: "Ipheclan personal brand site by Greyform",
    liveUrl: "https://ipheclan.com",
    liveUrlLabel: "ipheclan.com",
    role: "Design + Development",
    timeline: "3 weeks",
    stack: ["Next.js", "Tailwind", "GSAP", "Vercel"],
    // Hidden from /work, sitemap, and route generation until the writeup
    // and screenshot set are finalized. Flip `draft` to false to ship.
    draft: true,
  },
];

// Public list — drafts removed. Use this everywhere (homepage, /work, sitemap,
// case study routing). Order is preserved.
export const CASE_STUDIES: readonly CaseStudy[] = ALL_CASE_STUDIES.filter(
  (c) => !c.draft
);

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

export function getCaseStudyIndex(slug: string): number {
  return CASE_STUDIES.findIndex((c) => c.slug === slug);
}

export function getNextCaseStudy(slug: string): CaseStudy | undefined {
  const i = getCaseStudyIndex(slug);
  if (i < 0) return undefined;
  return CASE_STUDIES[(i + 1) % CASE_STUDIES.length];
}

// Aggregated quotes for the homepage strip. Pulls from case studies that have
// a `testimonial` set — no duplicate source of truth, so a quote you add to a
// case study automatically appears on the homepage too.
export type HomeTestimonial = Testimonial & {
  client: string;
  slug: string;
};

export const TESTIMONIALS: readonly HomeTestimonial[] = CASE_STUDIES.flatMap(
  (cs) =>
    cs.testimonial
      ? [{ ...cs.testimonial, client: cs.client, slug: cs.slug }]
      : []
);
