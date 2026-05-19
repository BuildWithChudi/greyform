"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

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
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease } },
};

const sectionContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const sectionLine: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease } },
};

const PRACTICE: { num: string; label: string; note: string }[] = [
  { num: "01", label: "Web design", note: "Editorial, deliberate, never templated" },
  { num: "02", label: "Web development", note: "Next.js, TypeScript, hand-coded" },
  { num: "03", label: "Brand systems", note: "Type, voice, art direction" },
  { num: "04", label: "SEO & performance", note: "Built fast, found fast" },
  { num: "05", label: "Based in Lagos", note: "Working globally · GMT+1" },
];

// ImageKit transform: 4:5 aspect, face-aware crop, quality 85.
const PORTRAIT_SRC =
  "https://ik.imagekit.io/chewdee/tr:ar-4-5,fo-face,q-85,w-960/greyform/greyform/team/chudi-ceo-greyform.jpg";

export default function AboutView() {
  return (
    <>
      {/* ────────────────────────── Hero ────────────────────────── */}
      <section className="px-6 pt-32 pb-20 md:px-10 md:pt-40 md:pb-28">
        <motion.div
          variants={headerContainer}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-[1400px]"
        >
          <motion.p
            variants={headerLine}
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted"
          >
            Greyform / About
          </motion.p>

          <motion.h1
            variants={headerHeading}
            className="mt-10 max-w-[20ch] font-display tracking-tightest text-fg leading-[1.02]"
            style={{ fontSize: "clamp(2.75rem, 6.5vw, 5.25rem)" }}
          >
            A small studio in Lagos, making{" "}
            <em className="italic">deliberate</em> websites.
          </motion.h1>

          <motion.p
            variants={headerLine}
            className="mt-10 max-w-[58ch] text-fluid-lg leading-relaxed text-muted"
          >
            We work with businesses, schools, and creators who&rsquo;d rather
            be remembered than just present. Every site we ship is built from
            scratch, on a modern stack, with the same care a stationery
            designer brings to a single letterhead.
          </motion.p>
        </motion.div>
      </section>

      {/* ────────────────── What we do ────────────────── */}
      <section className="px-6 py-24 md:px-10 md:py-32 border-t border-line">
        <motion.div
          variants={sectionContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
          className="mx-auto max-w-[1400px] grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-12 md:gap-x-16"
        >
          <motion.div variants={sectionLine} className="md:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              What we do
            </p>
          </motion.div>

          <div className="md:col-span-8">
            <motion.h2
              variants={sectionLine}
              className="font-display tracking-tightest text-fg leading-[1.05]"
              style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
            >
              Custom sites, redesigns, and the occasional product.
            </motion.h2>

            <motion.p
              variants={sectionLine}
              className="mt-8 text-fluid-lg leading-relaxed text-fg/85"
            >
              Design and development stay in the same pair of hands, so the
              work doesn&rsquo;t lose its mind between Figma and production.
              Sites ship fast, look like themselves, and stay easy to update
              long after we&rsquo;ve cleared off the calendar.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ────────────────── Leadership / portrait ────────────────── */}
      <section className="border-t border-line bg-bg">
        <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
            transition={{ duration: 0.7, ease }}
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted"
          >
            Leadership / Founder
          </motion.p>

          <div className="mt-12 grid grid-cols-1 items-start gap-x-12 gap-y-12 md:grid-cols-12 md:gap-x-16">
            <motion.figure
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
              transition={{ duration: 0.95, ease }}
              className="md:col-span-5 lg:col-span-5"
            >
              <div className="relative w-full overflow-hidden rounded-md border border-line bg-fg/[0.04]" style={{ aspectRatio: "4 / 5" }}>
                <Image
                  src={PORTRAIT_SRC}
                  alt="Chudi Ofoma, Founder and Creative Director of Greyform, photographed in Lagos."
                  fill
                  sizes="(min-width: 1024px) 520px, (min-width: 768px) 44vw, 92vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                <span>Chudi Ofoma · Lagos</span>
                <span>2026</span>
              </figcaption>
            </motion.figure>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
              transition={{ duration: 0.85, ease, delay: 0.1 }}
              className="md:col-span-7 lg:col-span-6 lg:col-start-7"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                Founder &amp; Creative Director
              </p>

              <h3
                className="mt-4 font-display tracking-tightest text-fg leading-[1.02]"
                style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)" }}
              >
                Chudi <em className="italic">Ofoma</em>.
              </h3>

              <p className="mt-8 text-fluid-lg leading-relaxed text-fg/85">
                Chudi started Greyform after about a decade of making things
                on the web. He leads design and engineering on every project,
                sets the bar for what leaves the studio, and writes most of
                the words you&rsquo;re reading right now.
              </p>

              <p className="mt-5 text-fluid-lg leading-relaxed text-fg/85">
                Off-hours, he lectures CSC 102 at Pan-Atlantic University,
                which is a useful way to stay honest. You can&rsquo;t bluff
                first-years.
              </p>

              <dl className="mt-12 grid grid-cols-2 gap-y-6 border-t border-line pt-8 sm:grid-cols-3">
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                    Role
                  </dt>
                  <dd className="mt-2 text-fluid-base text-fg/90">
                    Design &amp; engineering
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                    Based
                  </dt>
                  <dd className="mt-2 text-fluid-base text-fg/90">
                    Lagos · GMT+1
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                    Also
                  </dt>
                  <dd className="mt-2 text-fluid-base text-fg/90">
                    Lectures CSC 102, PAU
                  </dd>
                </div>
              </dl>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ────────────────── Why Greyform exists ────────────────── */}
      <section className="px-6 py-24 md:px-10 md:py-32 border-t border-line">
        <motion.div
          variants={sectionContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
          className="mx-auto max-w-[1400px] grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-12 md:gap-x-16"
        >
          <motion.div variants={sectionLine} className="md:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              Why we exist
            </p>
          </motion.div>

          <div className="md:col-span-8">
            <motion.h2
              variants={sectionLine}
              className="font-display tracking-tightest text-fg leading-[1.05]"
              style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
            >
              Most web work is competent. Very little of it is memorable.
            </motion.h2>

            <motion.p
              variants={sectionLine}
              className="mt-8 text-fluid-lg leading-relaxed text-fg/85"
            >
              We sit in that gap. We take on fewer projects than we could,
              spend longer than is convenient on each one, and would rather
              ship something a little inconvenient to compare than something
              instantly forgettable. Fewer projects, properly done.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ────────────────────── Practice ────────────────────── */}
      <section className="px-6 py-24 md:px-10 md:py-32 border-t border-line">
        <motion.div
          variants={sectionContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
          className="mx-auto max-w-[1400px]"
        >
          <motion.p
            variants={sectionLine}
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted"
          >
            Practice
          </motion.p>

          <ul className="mt-10 border-t border-line">
            {PRACTICE.map((p) => (
              <motion.li
                key={p.num}
                variants={sectionLine}
                className="grid grid-cols-12 items-baseline gap-x-6 border-b border-line py-6"
              >
                <span className="col-span-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted md:col-span-1">
                  {p.num}
                </span>
                <span
                  className="col-span-10 font-display tracking-tightest text-fg leading-[1.05] md:col-span-5"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
                >
                  {p.label}
                </span>
                <span className="col-span-12 mt-2 text-fluid-base text-muted md:col-span-6 md:mt-0 md:text-right">
                  {p.note}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* ────────────────────── Get in touch ────────────────────── */}
      <section className="px-6 py-24 md:px-10 md:py-32 border-t border-line">
        <motion.div
          variants={sectionContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
          className="mx-auto max-w-3xl"
        >
          <motion.p
            variants={sectionLine}
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted"
          >
            Work with us
          </motion.p>

          <motion.h2
            variants={sectionLine}
            className="mt-6 font-display italic tracking-tightest text-fg leading-[1.05]"
            style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)" }}
          >
            Got a project worth doing?
          </motion.h2>

          <motion.p
            variants={sectionLine}
            className="mt-6 max-w-[52ch] text-fluid-lg leading-relaxed text-muted"
          >
            Tell us about it. Four short steps, two minutes. We&rsquo;ll reply
            within 48 hours, usually faster.
          </motion.p>

          <motion.div
            variants={sectionLine}
            className="mt-10 flex flex-wrap items-center gap-6"
          >
            <Link
              href="/start"
              data-cursor="hover"
              className="group inline-flex items-center gap-3 rounded-full bg-fg px-7 py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-bg transition-all duration-300 hover:bg-bg hover:text-fg hover:ring-1 hover:ring-fg"
            >
              Start a project
              <span aria-hidden className="transition-transform duration-300 group-hover:rotate-45">↗</span>
            </Link>

            <a
              href="mailto:hello@greyform.org"
              data-cursor="hover"
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg underline underline-offset-4 decoration-fg/30 hover:decoration-fg"
            >
              Or email hello@greyform.org
            </a>
          </motion.div>

          <motion.p
            variants={sectionLine}
            className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-muted"
          >
            Call or WhatsApp{" "}
            <a
              href="tel:+2347062200791"
              data-cursor="hover"
              className="text-fg underline underline-offset-4 decoration-fg/30 hover:decoration-fg"
            >
              +234 706 220 0791
            </a>
          </motion.p>
        </motion.div>
      </section>
    </>
  );
}
