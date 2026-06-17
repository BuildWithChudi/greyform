"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const header: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const headerLine: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

const rows: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const row: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

import { SERVICES } from "@/data/services";

export default function ServicesPreview() {
  return (
    <section
      id="services"
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
          02 / Services
        </motion.p>

        <motion.h2
          variants={headerLine}
          className="mt-6 max-w-[18ch] text-balance font-display tracking-tightest text-fg leading-[1.05]"
          style={{ fontSize: "clamp(2.25rem, 4.5vw, 4rem)" }}
        >
          Three ways to work together.<span className="italic text-muted"> Pick the closest fit.</span>
        </motion.h2>
      </motion.div>

      <motion.ul
        variants={rows}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
        className="mx-auto mt-16 max-w-[1400px] border-y border-line divide-y divide-line"
      >
        {SERVICES.map((s) => (
          <motion.li key={s.number} variants={row}>
            <Link
              href={`/services#${s.slug}`}
              data-cursor="hover"
              aria-label={`${s.title}, ${s.pricePreview}`}
              className="group block origin-center transition-[transform,background-color] duration-500 ease-out hover:scale-[1.01] hover:bg-[#F2F2F2] dark:hover:bg-[#161616] will-change-transform"
            >
              <div className="grid grid-cols-12 items-start gap-x-4 gap-y-4 px-4 py-10 md:gap-x-8 md:px-8 md:py-14">
                <span className="col-span-2 font-mono text-fluid-xs text-muted md:col-span-1">
                  {s.number}
                </span>

                <div className="col-span-10 md:col-span-7">
                  <h3
                    className="font-display uppercase tracking-tight text-fg leading-[1.05]"
                    style={{ fontSize: "clamp(1.75rem, 3.5vw, 3rem)" }}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-prose text-fluid-base text-muted leading-relaxed">
                    {s.summary}
                  </p>
                </div>

                <div className="col-span-12 flex items-center justify-between gap-4 md:col-span-4 md:justify-end md:gap-8">
                  <span className="font-mono text-fluid-xs uppercase tracking-[0.16em] text-muted whitespace-nowrap">
                    {s.pricePreview}
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="h-5 w-5 -translate-x-2 opacity-0 text-fg transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </div>
              </div>
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
