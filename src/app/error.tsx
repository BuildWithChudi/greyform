"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, RotateCcw } from "lucide-react";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const line: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const heading: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease } },
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaces in Vercel logs and any error sink wired into console.error.
    console.error("[app/error]", error);
  }, [error]);

  return (
    <section className="relative flex min-h-screen items-center px-6 pt-32 pb-24 md:px-10 md:pt-40">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="mx-auto w-full max-w-3xl"
      >
        <motion.p
          variants={line}
          className="font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted"
        >
          Greyform / Error
        </motion.p>

        <motion.h1
          variants={heading}
          className="mt-8 max-w-[20ch] font-display tracking-tightest text-fg leading-[1.02]"
          style={{ fontSize: "clamp(2.75rem, 6.5vw, 5.25rem)" }}
        >
          Something <em className="italic">broke</em> on our side.
        </motion.h1>

        <motion.p
          variants={line}
          className="mt-10 max-w-[52ch] text-fluid-lg leading-relaxed text-muted"
        >
          A small thing, almost certainly. Try the page again — and if it
          keeps happening, tell us at{" "}
          <a
            href="mailto:hello@greyform.org"
            data-cursor="hover"
            className="text-fg underline underline-offset-4 decoration-fg/30 hover:decoration-fg"
          >
            hello@greyform.org
          </a>
          .
        </motion.p>

        <motion.div
          variants={line}
          className="mt-12 flex flex-wrap items-center gap-3"
        >
          <button
            type="button"
            onClick={reset}
            data-cursor="hover"
            className="group inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3.5 font-mono text-fluid-xs uppercase tracking-[0.18em] text-bg transition-colors duration-300 hover:bg-bg hover:text-fg hover:ring-1 hover:ring-fg"
          >
            <RotateCcw className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-180" />
            Try again
          </button>

          <Link
            href="/"
            data-cursor="hover"
            className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-mono text-fluid-xs uppercase tracking-[0.18em] text-fg ring-1 ring-fg/40 transition-colors duration-300 hover:bg-fg hover:text-bg hover:ring-fg"
          >
            Back home
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {error.digest && (
          <motion.p
            variants={line}
            className="mt-16 border-t border-line pt-6 font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted"
          >
            Ref · <span className="text-fg/80">{error.digest}</span>
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}
