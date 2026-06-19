"use client";

import { motion, type Variants } from "framer-motion";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.1 },
  },
};

const line: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

const headingLine: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease } },
};

const followUp = [
  "We sell results.",
  "A site that loads fast, looks like itself, ranks well, and earns its place on every device in your client's pocket.",
  "Anything less is just a brochure.",
];

export default function Philosophy() {
  return (
    <section
      id="philosophy"
      className="relative flex min-h-screen items-center justify-center px-6 py-32 md:px-10"
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
        className="mx-auto w-full max-w-4xl"
      >
        <motion.p
          variants={line}
          className="font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted"
        >
          01 / Philosophy
        </motion.p>

        <motion.h2
          variants={headingLine}
          className="mt-8 text-balance font-display tracking-tightest text-fg leading-[1.05]"
          style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}
        >
          We don&rsquo;t sell websites.
        </motion.h2>

        <div className="mt-10 space-y-5">
          {followUp.map((text, i) => (
            <motion.p
              key={i}
              variants={line}
              className="text-fluid-lg leading-relaxed text-muted"
            >
              {text}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
