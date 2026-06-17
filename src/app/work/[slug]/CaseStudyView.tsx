"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { CaseStudy, GalleryImage, StatItem } from "@/data/work";

type Props = {
  cs: CaseStudy;
  indexNumber: number; // 1-based
  next: CaseStudy | undefined;
};

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const headerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const headerLine: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};
const headerHeading: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease } },
};
const sectionContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.05 } },
};
const sectionLine: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease } },
};
const galleryItem: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

export default function CaseStudyView({ cs, indexNumber, next }: Props) {
  const indexLabel = String(indexNumber).padStart(2, "0");
  const hasDetail = !!(cs.problem || cs.approach || cs.outcome);

  return (
    <article>
      {/* ─────────────────────────── Hero ─────────────────────────── */}
      <section className="px-6 pt-32 pb-16 md:px-10 md:pt-40 md:pb-20">
        <motion.div
          variants={headerContainer}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-[1400px]"
        >
          <motion.p
            variants={headerLine}
            className="font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted"
          >
            Case study / {indexLabel}
          </motion.p>

          <motion.p
            variants={headerLine}
            className="mt-6 font-mono text-fluid-sm uppercase tracking-[0.16em] text-fg/70"
          >
            {cs.year} · {cs.client}
          </motion.p>

          <motion.h1
            variants={headerHeading}
            className="mt-6 max-w-[22ch] font-display tracking-tightest text-fg leading-[1.02]"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
          >
            {cs.title}
          </motion.h1>

          <motion.p
            variants={headerLine}
            className="mt-8 max-w-[60ch] text-fluid-lg leading-relaxed text-muted"
          >
            {cs.summary}
          </motion.p>
        </motion.div>
      </section>

      {/* ───────────────────────── Cover ───────────────────────── */}
      {/* Framed at the screenshots' native ~16:10 ratio so nothing meaningful
          is cropped — reads as a deliberate device frame, not a chopped image. */}
      <section className="px-6 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-fg/[0.04] ring-1 ring-line">
            <Image
              src={cs.cover}
              alt={cs.coverAlt}
              fill
              sizes="(min-width: 1440px) 1400px, 100vw"
              priority
              className="object-cover object-top"
            />
          </div>
        </div>
      </section>

      {/* ─────────────────────────── Meta strip ─────────────────────────── */}
      <MetaStrip cs={cs} />

      {/* ────────────────────── Problem / Approach / Outcome ────────────────────── */}
      {cs.problem && (
        <NarrativeSection
          stepLabel="01 / Problem"
          heading={cs.problem.heading}
          body={cs.problem.body}
          images={cs.problem.images}
        />
      )}

      {cs.approach && (
        <NarrativeSection
          stepLabel="02 / Approach"
          heading={cs.approach.heading}
          body={cs.approach.body}
          images={cs.approach.images}
        />
      )}

      {cs.outcome && (
        <NarrativeSection
          stepLabel="03 / Outcome"
          heading={cs.outcome.heading}
          body={cs.outcome.body}
          images={cs.outcome.images}
          stats={cs.outcome.stats}
        />
      )}

      {/* ─────────────────────────── Coming soon ─────────────────────────── */}
      {!hasDetail && <ComingSoon cs={cs} />}

      {/* ─────────────────────────── Gallery ─────────────────────────── */}
      {cs.gallery && cs.gallery.length > 0 && (
        <Gallery items={cs.gallery} />
      )}

      {/* ─────────────────────────── Testimonials ─────────────────────────── */}
      {cs.testimonials && cs.testimonials.length > 0 && (
        <section className="px-6 py-24 md:px-10 md:py-32">
          <motion.div
            variants={sectionContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
            className="mx-auto max-w-3xl space-y-12 md:space-y-16"
          >
            {cs.testimonials.map((t, i) => (
              <motion.figure key={i} variants={sectionLine}>
                <blockquote className="border-l-2 border-fg pl-6 md:pl-8">
                  <p
                    className="font-display italic text-fg leading-[1.2]"
                    style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <figcaption className="mt-6 font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted not-italic">
                    {t.attribution}
                  </figcaption>
                </blockquote>
              </motion.figure>
            ))}
          </motion.div>
        </section>
      )}

      {/* ─────────────────────────── Closing ─────────────────────────── */}
      <section className="px-6 pt-12 pb-32 md:px-10 md:pt-20 md:pb-40">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-10 border-t border-line pt-12 md:flex-row md:items-end md:pt-16">
          <div>
            <p className="font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted">
              Up next
            </p>
            {next ? (
              <Link
                href={`/work/${next.slug}`}
                data-cursor="hover"
                className="group mt-4 inline-flex items-baseline gap-3"
              >
                <span
                  className="font-display tracking-tightest text-fg leading-[1.02] group-hover:underline underline-offset-[6px] decoration-fg/40 decoration-[1.5px]"
                  style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
                >
                  {next.client}
                </span>
                <ArrowUpRight className="h-5 w-5 shrink-0 translate-y-1 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0" />
              </Link>
            ) : (
              <p className="mt-4 font-display text-fluid-3xl text-muted">
                More soon.
              </p>
            )}
          </div>

          <Link
            href="/work"
            data-cursor="hover"
            className="group inline-flex items-center gap-2 border-b border-fg/30 pb-1 font-mono text-fluid-xs uppercase tracking-[0.2em] text-fg transition-colors hover:border-fg"
          >
            All work
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </section>
    </article>
  );
}

/* ───────────────────────────── meta strip ───────────────────────────── */

function MetaStrip({ cs }: { cs: CaseStudy }) {
  type Item = { label: string; value: string; href?: string };
  const items: Item[] = [
    { label: "Role", value: cs.role },
    ...(cs.timeline ? [{ label: "Timeline", value: cs.timeline }] : []),
    ...(cs.stack ? [{ label: "Stack", value: cs.stack.join(", ") }] : []),
    {
      label: "Live",
      value: cs.liveUrlLabel,
      href: cs.liveUrl,
    },
  ];

  return (
    <section className="border-y border-line">
      <dl className="mx-auto grid max-w-[1400px] grid-cols-1 divide-y divide-line md:grid-cols-4 md:divide-y-0 md:divide-x">
        {items.map((item) => (
          <div
            key={item.label}
            className="px-6 py-5 md:px-8 md:py-6 lg:px-10"
          >
            <dt className="font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted">
              {item.label}
            </dt>
            <dd className="mt-2 font-mono text-fluid-sm text-fg">
              {item.href ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  className="group inline-flex items-center gap-1.5 underline underline-offset-4 decoration-fg/30 hover:decoration-fg"
                >
                  {item.value}
                  <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ) : (
                item.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/* ───────────────────────────── narrative section ───────────────────────────── */

function NarrativeSection({
  stepLabel,
  heading,
  body,
  images,
  stats,
}: {
  stepLabel: string;
  heading: string;
  body: string;
  images?: readonly GalleryImage[];
  stats?: readonly StatItem[];
}) {
  return (
    <section className="px-6 py-24 md:px-10 md:py-32">
      <motion.div
        variants={sectionContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
        className="mx-auto max-w-3xl"
      >
        <motion.p
          variants={sectionLine}
          className="font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted"
        >
          {stepLabel}
        </motion.p>

        <motion.h2
          variants={sectionLine}
          className="mt-6 font-display tracking-tightest text-fg leading-[1.05]"
          style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
        >
          {heading}
        </motion.h2>

        <motion.p
          variants={sectionLine}
          className="mt-8 text-fluid-lg leading-relaxed text-fg/85"
        >
          {body}
        </motion.p>

        {stats && stats.length > 0 && (
          <motion.dl
            variants={sectionLine}
            className="mt-14 grid grid-cols-1 gap-y-8 border-t border-line pt-10 sm:grid-cols-3 sm:gap-x-10"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd
                  className="font-display tracking-tightest text-fg leading-none"
                  style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)" }}
                >
                  {s.value}
                </dd>
                <p className="mt-3 font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.dl>
        )}
      </motion.div>

      {images && images.length > 0 && (
        <div className="mx-auto mt-16 grid max-w-[1400px] grid-cols-1 gap-6 md:gap-10">
          {images.map((img) => (
            <motion.figure
              key={img.src}
              variants={galleryItem}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
              className="space-y-3"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md bg-fg/[0.04] ring-1 ring-line">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 900px, 100vw"
                  className="object-cover"
                />
              </div>
              {img.caption && (
                <figcaption className="font-mono text-fluid-xs uppercase tracking-[0.16em] text-muted">
                  {img.caption}
                </figcaption>
              )}
            </motion.figure>
          ))}
        </div>
      )}
    </section>
  );
}

/* ───────────────────────────── gallery ───────────────────────────── */

function Gallery({ items }: { items: readonly GalleryImage[] }) {
  return (
    <section className="px-6 pb-24 pt-8 md:px-10 md:pb-32 md:pt-12">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
        {items.map((img) => (
          <motion.figure
            key={img.src}
            variants={galleryItem}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
            className="space-y-3"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-fg/[0.04] ring-1 ring-line">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 1024px) 640px, 100vw"
                className="object-cover"
              />
            </div>
            {img.caption && (
              <figcaption className="font-mono text-fluid-xs uppercase tracking-[0.16em] text-muted">
                {img.caption}
              </figcaption>
            )}
          </motion.figure>
        ))}
      </div>
    </section>
  );
}

/* ──────────────── coming-soon stub for case studies w/o body ──────────────── */

function ComingSoon({ cs }: { cs: CaseStudy }) {
  return (
    <section className="px-6 py-24 md:px-10 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
        transition={{ duration: 0.85, ease }}
        className="mx-auto max-w-3xl text-center"
      >
        <p className="font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted">
          Writeup in progress
        </p>
        <h2
          className="mt-6 font-display italic tracking-tightest text-fg leading-[1.05]"
          style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)" }}
        >
          Full case study landing soon.
        </h2>
        <p className="mt-6 text-fluid-base leading-relaxed text-muted">
          The detailed writeup is being put together. In the meantime, the site
          is live and worth a look.
        </p>
        <div className="mt-10 flex justify-center">
          <a
            href={cs.liveUrl}
            target="_blank"
            rel="noreferrer"
            data-cursor="hover"
            className="group inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3.5 font-mono text-fluid-xs uppercase tracking-[0.2em] text-bg transition-colors duration-300 hover:bg-bg hover:text-fg hover:ring-1 hover:ring-fg"
          >
            Visit {cs.liveUrlLabel}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
