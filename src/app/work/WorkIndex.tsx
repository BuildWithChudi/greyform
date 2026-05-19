"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CASE_STUDIES } from "@/data/work";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const headerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const headerLine: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

const row: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

export default function WorkIndex() {
  return (
    <section className="px-6 pt-32 pb-32 md:px-10 md:pt-40 md:pb-40">
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
          Greyform / Work
        </motion.p>

        <motion.h1
          variants={headerLine}
          className="mt-6 font-display tracking-tightest text-fg leading-[1.02]"
          style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
        >
          Selected work.
        </motion.h1>

        <motion.p
          variants={headerLine}
          className="mt-8 max-w-[58ch] text-fluid-lg leading-relaxed text-muted"
        >
          Quality over quantity. Every site below was designed and built by
          Greyform, from a blank file. Live, in production, no demo data.
        </motion.p>
      </motion.div>

      <ul className="mx-auto mt-24 max-w-[1400px] border-y border-line divide-y divide-line">
        {CASE_STUDIES.map((cs, i) => {
          const index = String(i + 1).padStart(2, "0");
          const imageRight = i % 2 === 1;
          return (
            <motion.li
              key={cs.slug}
              variants={row}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
            >
              <Link
                href={`/work/${cs.slug}`}
                data-cursor="hover"
                aria-label={`${cs.client}: ${cs.title}`}
                className="group block py-16 md:py-24 lg:py-32"
              >
                <div className="grid grid-cols-1 items-center gap-y-10 md:grid-cols-12 md:gap-x-12 lg:gap-x-20">
                  {/* Image column */}
                  <div
                    className={cn(
                      "md:col-span-7",
                      imageRight ? "md:order-2" : "md:order-1"
                    )}
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-md bg-fg/[0.04] ring-1 ring-line">
                      <Image
                        src={cs.cover}
                        alt={cs.coverAlt}
                        fill
                        sizes="(min-width: 1024px) 820px, (min-width: 768px) 60vw, 100vw"
                        className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.02]"
                        priority={i === 0}
                      />
                    </div>
                  </div>

                  {/* Text column */}
                  <div
                    className={cn(
                      "md:col-span-5",
                      imageRight ? "md:order-1" : "md:order-2"
                    )}
                  >
                    <p className="font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted">
                      {index} · {cs.year}
                    </p>

                    <h2
                      className="mt-5 font-display tracking-tight text-fg leading-[1.05] group-hover:underline underline-offset-[6px] decoration-fg/40 decoration-[1.5px]"
                      style={{ fontSize: "clamp(2rem, 3.5vw, 3.25rem)" }}
                    >
                      {cs.client}
                    </h2>

                    <p
                      className="mt-4 text-fluid-lg leading-[1.3] text-fg"
                      style={{ fontWeight: 400 }}
                    >
                      {cs.title}
                    </p>

                    <p className="mt-5 max-w-[50ch] text-fluid-base leading-relaxed text-muted line-clamp-3">
                      {cs.summary}
                    </p>

                    <ul className="mt-7 flex flex-wrap gap-2">
                      {cs.tags.map((tag) => (
                        <li
                          key={tag}
                          className="inline-flex items-center border border-line px-2.5 py-1 font-mono text-fluid-xs uppercase tracking-[0.16em] text-muted"
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>

                    <span className="mt-8 inline-flex items-center gap-2 font-mono text-fluid-xs uppercase tracking-[0.2em] text-fg/80 transition-colors group-hover:text-fg">
                      Read Case Study
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
