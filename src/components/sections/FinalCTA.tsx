"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const line: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease } },
};

const heading: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease } },
};

export default function FinalCTA() {
  return (
    <section
      id="contact"
      className="relative flex min-h-screen items-center justify-center px-6 py-32 md:px-10 md:py-40"
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
        className="mx-auto w-full max-w-4xl text-center"
      >
        <motion.p
          variants={line}
          className="font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted"
        >
          04 / Get in touch
        </motion.p>

        <motion.h2
          variants={heading}
          className="mt-8 font-display italic tracking-tightest text-fg leading-[1.02]"
          style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
        >
          Got a project worth doing?
        </motion.h2>

        <motion.p
          variants={line}
          className="mx-auto mt-8 max-w-[52ch] text-fluid-lg leading-relaxed text-muted"
        >
          Tell us about it. We reply within 48 hours, usually faster, with a
          clear next step (or an honest no).
        </motion.p>

        <motion.div variants={line} className="mt-12 flex justify-center">
          <Link
            href="/start"
            data-cursor="hover"
            className="group inline-flex items-center gap-3 rounded-full bg-fg px-8 py-5 font-mono text-fluid-sm uppercase tracking-[0.2em] text-bg transition-colors duration-300 hover:bg-bg hover:text-fg hover:ring-1 hover:ring-fg"
          >
            Start a Project
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
          </Link>
        </motion.div>

        <motion.p
          variants={line}
          className="mt-8 font-mono text-fluid-xs text-muted"
        >
          Or email us directly at{" "}
          <a
            href="mailto:hello@greyform.org"
            data-cursor="hover"
            className="text-fg underline underline-offset-4 decoration-fg/30 hover:decoration-fg"
          >
            hello@greyform.org
          </a>
        </motion.p>

        <motion.p
          variants={line}
          className="mt-3 font-mono text-fluid-xs text-muted"
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
  );
}
