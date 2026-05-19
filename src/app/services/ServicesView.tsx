"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { SERVICES, type Service } from "@/data/services";

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

const blockContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};
const blockLine: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease } },
};
const checkItem: Variants = {
  hidden: { opacity: 0, x: -8 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease } },
};

export default function ServicesView() {
  return (
    <>
      <section className="px-6 pt-32 pb-16 md:px-10 md:pt-40 md:pb-24">
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
            Greyform / Services
          </motion.p>

          <motion.h1
            variants={headerHeading}
            className="mt-6 max-w-[22ch] font-display tracking-tightest text-fg leading-[1.02]"
            style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
          >
            Three ways to work together.
          </motion.h1>

          <motion.p
            variants={headerLine}
            className="mt-8 max-w-[60ch] text-fluid-lg leading-relaxed text-muted"
          >
            Different scopes, same standard of work. Pick the closest fit and
            we&rsquo;ll refine the details together.
          </motion.p>
        </motion.div>
      </section>

      {SERVICES.map((service, i) => (
        <ServiceBlock
          key={service.slug}
          service={service}
          showTopHairline={i > 0}
        />
      ))}
    </>
  );
}

function ServiceBlock({
  service,
  showTopHairline,
}: {
  service: Service;
  showTopHairline: boolean;
}) {
  return (
    <section
      id={service.slug}
      className={
        showTopHairline ? "border-t-[4px] border-fg/90" : undefined
      }
    >
      <div className="flex min-h-screen items-center px-6 py-24 md:px-10 md:py-32">
        <motion.div
          variants={blockContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
          className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-x-10 gap-y-10 md:grid-cols-12 md:gap-x-16"
        >
          {/* Big mono number — left */}
          <motion.div variants={blockLine} className="md:col-span-3">
            <p
              className="font-mono leading-none text-fg/90 tracking-tightest"
              style={{ fontSize: "clamp(4.5rem, 9vw, 9rem)" }}
            >
              {service.number}
            </p>
          </motion.div>

          {/* Content — right */}
          <div className="md:col-span-9">
            <motion.h2
              variants={blockLine}
              className="font-display tracking-tightest text-fg leading-[1.02]"
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)" }}
            >
              {service.title}
            </motion.h2>

            <motion.p
              variants={blockLine}
              className="mt-8 max-w-[58ch] text-fluid-lg leading-relaxed text-muted"
            >
              {service.description}
            </motion.p>

            <motion.div variants={blockLine} className="mt-14">
              <p className="font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted">
                What&rsquo;s included
              </p>
              <ul className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-x-10">
                {service.whatsIncluded.map((item) => (
                  <motion.li
                    key={item}
                    variants={checkItem}
                    className="flex items-start gap-3 text-fluid-base leading-snug text-fg/90"
                  >
                    <Check
                      aria-hidden
                      className="mt-[0.3em] h-3.5 w-3.5 shrink-0 text-fg"
                      strokeWidth={2.5}
                    />
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              variants={blockLine}
              className="mt-14 flex flex-col items-start gap-8 border-t border-line pt-10 md:flex-row md:items-end md:justify-between md:gap-12"
            >
              <div>
                <p className="font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted">
                  {service.priceLabel}
                </p>
                <p
                  className="mt-3 font-display tracking-tightest text-fg leading-none"
                  style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
                >
                  {service.priceDetail}
                </p>
              </div>

              <Link
                href={service.ctaHref}
                data-cursor="hover"
                className="group inline-flex items-center gap-3 rounded-full bg-fg px-7 py-4 font-mono text-fluid-xs uppercase tracking-[0.2em] text-bg transition-all duration-300 hover:bg-bg hover:text-fg hover:ring-1 hover:ring-fg"
              >
                {service.ctaLabel}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
