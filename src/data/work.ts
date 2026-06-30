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
  // Ordered by prominence. The first is the "featured" quote shown on the
  // homepage strip; the case-study page renders all of them.
  testimonials?: readonly Testimonial[];

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
    title: "A complete digital reset for a 25-year-old Lagos Catholic school.",
    year: "2026",
    summary:
      "A ground-up rebuild for a Lagos Catholic boys' school with twenty-five years behind it — and a website that no longer reflected the institution. Built around the school's “Duc in Altum” identity: fast on the mid-range phones parents actually use, editorial enough to read as established, and structured around what a parent needs to find in ten seconds.",
    tags: ["Web Design", "Development", "SEO", "Brand"],
    cover:
      "https://res.cloudinary.com/dud5owpai/image/upload/v1781459603/whitesands-website-screenshot_sr38qn.png",
    coverAlt: "Whitesands School website by Greyform — the “Duc in Altum” homepage",
    liveUrl: "https://www.whitesands.org.ng",
    liveUrlLabel: "whitesands.org.ng",
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
    // First quote is the named client (Andrew Eze, cleared for use). The rest
    // are reviews Andrew forwarded from people he sent the link to — real, but
    // we don't have names, so they're attributed honestly as anonymous rather
    // than given invented ones. Add more as they come in.
    testimonials: [
      {
        quote:
          "Everyone I've sent the link to for appraisal has rated the work very high.",
        attribution: "Andrew Eze · Whitesands School",
      },
      {
        quote:
          "The CTAs are quite compelling. This upgrade is long overdue.",
        attribution: "Forwarded review · via Whitesands School",
      },
      {
        quote:
          "This is beautiful. For a school like Whitesands, the upgrade is long overdue.",
        attribution: "Forwarded review · via Whitesands School",
      },
    ],
  },
  {
    slug: "ipheclan",
    client: "Iphe / Ipheclan",
    title: "Personal brand site for a 4M+ TikTok creator.",
    year: "2026",
    summary:
      "A single-page identity site for one of Nigeria's most-followed lifestyle creators. Confident, slow-scrolling editorial layout. Press-ready bio. A booking flow that doesn't feel like a form.",
    tags: ["Web Design", "Development", "Personal Brand"],
    cover:
      "https://res.cloudinary.com/dud5owpai/image/upload/v1781459595/ipheclan-website-screenshot_jb7a6t.png",
    coverAlt: "Ipheclan personal brand site by Greyform — the IPHE wordmark hero",
    liveUrl: "https://www.ipheclan.com",
    liveUrlLabel: "ipheclan.com",
    role: "Design + Development",
    timeline: "3 weeks",
    stack: ["Next.js", "Tailwind", "GSAP", "Vercel"],
    problem: {
      heading: "Four million followers, and nowhere that was actually his.",
      body: "Iphe's entire reach lived on platforms he doesn't own — TikTok, Instagram, whatever the algorithm favours that month — and a link-in-bio is a list, not a brand. The site exists to turn a large rented audience into an owned one: a single home that represents him, holds his work, and gives brands a clear, credible way to get in touch.",
    },
    approach: {
      heading: "One page, slow-scrolled, that feels like him — not a link-in-bio.",
      body: "We built a single-page identity site with a deliberately cinematic scroll — Lenis for the buttery feel, GSAP for the choreography — so it moves with the same polish as his content. Enough personality and motion to read as a creator's space rather than a corporate page, held to a strict performance budget because his audience arrives on phones and leaves the moment a page stalls. Hand-built in Next.js on Vercel, tuned to stay fast on the mid-range Android most of that audience is actually holding.",
    },
    outcome: {
      heading: "Signed off on the spot — balance paid before launch.",
      body: "On the review call the reaction was immediate: Iphe walked the site once and paid the remaining balance before deployment and email were even wired up. The site now does the job his DMs used to — one link, press-ready and booking-ready, unmistakably his. Built end-to-end by Chudi, Greyform's founder.",
      stats: [
        { value: "4M+", label: "Creator following" },
        { value: "3 wks", label: "Concept to launch" },
        { value: "1", label: "Page, fully bespoke" },
      ],
    },
    // No client quote published yet — the "paid before launch" beat carries the
    // proof. Drop a verbatim line from Iphe here once you have his sign-off and
    // the homepage strip + case-study quote light up automatically.
  },
  {
    slug: "life-upside-view",
    client: "Life Upside View",
    title: "A mental-health platform built around one promise: you are not alone.",
    year: "2026",
    summary:
      "A support platform for people in a hard moment — somewhere to find a story, a tool, or a fast way to reach help. The design direction was the client's; our job was to build it into something steady and quick on the phones people actually open at 2am. Searchable stories of resilience, a low-pressure self check-in, light and dark reading modes, more than one language, and a get-help route that's never more than a tap away.",
    tags: ["Development", "Accessibility", "Performance", "Nonprofit"],
    cover:
      "https://res.cloudinary.com/dud5owpai/image/upload/v1782633362/life-upside-view-website_x0ws31.png",
    coverAlt:
      "Life Upside View mental-health platform by Greyform — the “You are not alone” homepage",
    liveUrl: "https://www.lifeupsideview.org",
    liveUrlLabel: "lifeupsideview.org",
    role: "Development",
    stack: ["Next.js", "Tailwind", "Vercel"],
    problem: {
      heading: "When someone is reaching out, every bit of friction is a reason to close the tab.",
      body: "Life Upside View needed a home that could meet people at a low point — often anxious, often late at night, often on a slow connection — and get them to something useful without making them work for it. In this context the basics carry real weight: a page that stalls, a menu that's hard to scan, or a help link buried two clicks down isn't a minor flaw, it's a person who leaves before they find anything. The client had a clear vision for how it should look and feel. The brief to us was to make that vision real without letting it get heavy or hard to reach.",
    },
    approach: {
      heading: "Build the client's design faithfully — then make it fast, legible, and easy to get help from.",
      body: "We worked directly with the client and implemented their design as specified, hand-coding it so the warmth of the original — the open imagery, the single steadying line, the calm spacing — survived the move from mockup to a live product without bloating. A persistent “Get help” route stays one tap from every screen. Light and dark modes let people read in whatever's easiest on the eyes in the moment, and a language toggle widens who the site can actually serve. Stories of resilience are searchable rather than buried, and the self check-in reads as a few honest questions instead of a clinical form. Throughout, the build is tuned to stay quick on the mid-range phones most of the audience is holding — because in a crisis, load time is part of the care.",
    },
    outcome: {
      heading: "A calm front door that does the hard part: getting people to help, fast.",
      body: "The site launched true to the client's design while staying fast and accessible — readable in both themes, navigable in more than one language, and quick to surface a story, a tool, or a way to talk to someone. The pieces that matter most here all sit within a tap or two of anywhere on the site: the standing get-help route, the low-friction check-in, the searchable stories. Built to the client's spec, hand-built for speed.",
    },
    // Role is honestly scoped to Development — the client led the design and we
    // implemented it. Stack assumes Greyform's standard hand-built setup; swap if
    // it differs. Add a client quote here once cleared and the homepage strip +
    // case-study quote light up automatically.
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

// Aggregated quotes for the homepage strip. Features the FIRST testimonial of
// each case study (the named/strongest one) so the homepage stays clean — the
// full set of reviews lives on the case-study page. No duplicate source of
// truth: a quote added to a case study flows here automatically.
export type HomeTestimonial = Testimonial & {
  client: string;
  slug: string;
};

export const TESTIMONIALS: readonly HomeTestimonial[] = CASE_STUDIES.flatMap(
  (cs) => {
    const featured = cs.testimonials?.[0];
    return featured ? [{ ...featured, client: cs.client, slug: cs.slug }] : [];
  }
);
