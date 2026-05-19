"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { TESTIMONIALS } from "@/data/work";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const line: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease } },
};

const quoteVar: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease } },
};

/**
 * Homepage testimonial strip. Sources from case-study `testimonial` fields via
 * the `TESTIMONIALS` aggregate in data/work.ts, so a quote added to a case
 * study shows up here automatically. Renders nothing when empty — premium
 * studios don't ship placeholder applause.
 */
export default function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <section
      id="testimonials"
      className="relative px-6 py-32 md:px-10 md:py-40"
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
        className="mx-auto max-w-[1400px]"
      >
        <motion.p
          variants={line}
          className="font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted"
        >
          In their words
        </motion.p>

        <ul className="mt-12 space-y-20 md:space-y-28">
          {TESTIMONIALS.map((t) => (
            <motion.li key={t.slug} variants={quoteVar}>
              <figure className="grid grid-cols-1 gap-y-8 md:grid-cols-12 md:gap-x-12">
                <div className="md:col-span-2">
                  <p
                    aria-hidden
                    className="font-display italic leading-none text-fg/40"
                    style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}
                  >
                    &ldquo;
                  </p>
                </div>
                <div className="md:col-span-10">
                  <blockquote>
                    <p
                      className="font-display tracking-tightest text-fg leading-[1.15]"
                      style={{ fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)" }}
                    >
                      {t.quote}
                    </p>
                  </blockquote>
                  <figcaption className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted">
                    <span className="text-fg/85">{t.attribution}</span>
                    <span aria-hidden>·</span>
                    <Link
                      href={`/work/${t.slug}`}
                      data-cursor="hover"
                      className="text-fg/70 underline underline-offset-4 decoration-fg/20 hover:text-fg hover:decoration-fg"
                    >
                      Read the case study
                    </Link>
                  </figcaption>
                </div>
              </figure>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
