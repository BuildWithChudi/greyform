"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { CASE_STUDIES } from "@/data/work";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const header: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const headerLine: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

const grid: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.15 } },
};

const card: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

export default function SelectedWork() {
  return (
    <section
      id="work"
      className="relative px-6 py-32 md:px-10 md:py-40"
    >
      <motion.div
        variants={header}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
        className="mx-auto max-w-[1400px]"
      >
        <motion.p
          variants={headerLine}
          className="font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted"
        >
          03 / Selected Work
        </motion.p>

        <motion.h2
          variants={headerLine}
          className="mt-6 max-w-[22ch] text-balance font-display tracking-tightest text-fg leading-[1.05]"
          style={{ fontSize: "clamp(2.25rem, 4.5vw, 4rem)" }}
        >
          Recent work, built by Greyform.
        </motion.h2>
      </motion.div>

      <motion.ul
        variants={grid}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
        className="mx-auto mt-16 grid max-w-[1400px] grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2 md:gap-y-20"
      >
        {CASE_STUDIES.map((p, i) => {
          const index = String(i + 1).padStart(2, "0");
          return (
            <motion.li key={p.slug} variants={card}>
              <Link
                href={`/work/${p.slug}`}
                data-cursor="hover"
                aria-label={`${p.client}: ${p.title}`}
                className="group block"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md bg-fg/[0.04] ring-1 ring-line">
                  <Image
                    src={p.cover}
                    alt={p.coverAlt}
                    fill
                    sizes="(min-width: 1024px) 640px, 100vw"
                    className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.02]"
                    priority={i === 0}
                  />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-fg/0 opacity-0 transition-all duration-500 ease-out group-hover:bg-fg/25 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-2 rounded-full bg-bg px-5 py-2.5 font-mono text-fluid-xs uppercase tracking-[0.2em] text-fg">
                      View
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <p className="font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted">
                      {index} · {p.year}
                    </p>
                    <h3
                      className="mt-3 font-display tracking-tight text-fg leading-[1.1] group-hover:underline underline-offset-[6px] decoration-fg/40 decoration-[1.5px]"
                      style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)" }}
                    >
                      {p.client}
                    </h3>
                    <p className="mt-3 max-w-prose text-fluid-base text-muted leading-relaxed">
                      {p.title}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-fluid-xs uppercase tracking-[0.18em] text-fg/80 transition-colors group-hover:text-fg">
                      View Case Study
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.li>
          );
        })}
      </motion.ul>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
        transition={{ duration: 0.7, ease, delay: 0.2 }}
        className="mx-auto mt-20 flex max-w-[1400px] justify-center"
      >
        <Link
          href="/work"
          data-cursor="hover"
          className="group inline-flex items-center gap-2 border-b border-fg/30 pb-1 font-mono text-fluid-xs uppercase tracking-[0.2em] text-fg transition-colors hover:border-fg"
        >
          View All Work
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </section>
  );
}
