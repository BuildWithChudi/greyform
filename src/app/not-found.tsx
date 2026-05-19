"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

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

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen items-center px-6 pt-32 pb-24 md:px-10 md:pt-40">
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="mx-auto grid w-full max-w-[1400px] grid-cols-12 gap-x-6 gap-y-12 md:gap-x-10"
      >
        {/* LEFT — editorial copy */}
        <div className="col-span-12 lg:col-span-9">
          <motion.p
            variants={line}
            className="font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted"
          >
            Greyform / 404
          </motion.p>

          <motion.h1
            variants={heading}
            className="mt-8 max-w-[18ch] font-display tracking-tightest text-fg leading-[1.02]"
            style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
          >
            This page <em className="italic">doesn&rsquo;t exist</em>.
          </motion.h1>

          <motion.p
            variants={line}
            className="mt-10 max-w-[52ch] text-fluid-lg leading-relaxed text-muted"
          >
            Either the link is wrong, or we moved something without leaving a
            forwarding address. Everything else is still here.
          </motion.p>

          <motion.div
            variants={line}
            className="mt-12 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/"
              data-cursor="hover"
              className="group inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3.5 font-mono text-fluid-xs uppercase tracking-[0.18em] text-bg transition-colors duration-300 hover:bg-bg hover:text-fg hover:ring-1 hover:ring-fg"
            >
              Back home
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/work"
              data-cursor="hover"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-mono text-fluid-xs uppercase tracking-[0.18em] text-fg ring-1 ring-fg/40 transition-colors duration-300 hover:bg-fg hover:text-bg hover:ring-fg"
            >
              See the work
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
            </Link>
          </motion.div>
        </div>

        {/* RIGHT — status panel mirroring the Hero "Now" panel */}
        <motion.aside
          variants={line}
          className="col-span-12 lg:col-span-3 lg:pt-2"
          aria-label="Status"
        >
          <div className="rounded-lg border border-line bg-bg/40 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted">
                Status / 404
              </span>
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-fg/60"
              />
            </div>
            <ul className="mt-4 space-y-3 font-mono text-fluid-xs leading-relaxed text-fg/85">
              <li className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-[0.55em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-muted/60"
                />
                <span>Page not found</span>
              </li>
              <li className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-[0.55em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-muted/60"
                />
                <span className="text-muted">Site healthy · all systems live</span>
              </li>
              <li className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-[0.55em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-muted/60"
                />
                <span className="text-muted">
                  Need a hand?{" "}
                  <a
                    href="mailto:hello@greyform.org"
                    className="text-fg underline underline-offset-4 decoration-fg/30 hover:decoration-fg"
                  >
                    Email us
                  </a>
                </span>
              </li>
            </ul>
          </div>
        </motion.aside>
      </motion.div>
    </section>
  );
}
