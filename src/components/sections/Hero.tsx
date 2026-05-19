"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ArrowUpRight, ArrowRight } from "lucide-react";

type Token = { text: string; italic?: boolean };

const HEADLINE: Token[] = [
  { text: "Websites" },
  { text: "that" },
  { text: "don’t", italic: true },
  { text: "look" },
  { text: "like" },
  { text: "they" },
  { text: "were" },
  { text: "made" },
  { text: "by" },
  { text: "AI." },
];

// Keep evergreen — no calendar dates that will rot. The pulse dot signals
// "live" so the panel reads as current without needing a refresh.
const NOW_ITEMS = [
  { label: "Booking new projects", pulse: true },
  { label: "Latest case study: Whitesands School", pulse: false },
  { label: "Replies within 48 hours", pulse: false },
];

const wordVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.1 + i * 0.08,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const HEADLINE_TOTAL_DELAY = 0.1 + HEADLINE.length * 0.08;

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const nowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ctx: gsap.Context | undefined;
    let cancelled = false;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    (async () => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        if (nowRef.current) {
          gsap.to(nowRef.current, {
            yPercent: -18,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }
        if (headlineRef.current) {
          gsap.to(headlineRef.current, {
            yPercent: -6,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      }, sectionRef);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full px-6 pt-[25vh] pb-24 md:px-10"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-x-6 gap-y-16 md:gap-x-10">
        {/* LEFT — headline block */}
        <div
          ref={headlineRef}
          className="col-span-12 lg:col-span-9 will-change-transform"
        >
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted"
          >
            Greyform · 00 / Home
          </motion.p>

          <h1
            className="mt-8 font-display tracking-tightest text-fg leading-[1.05]"
            style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
          >
            <span className="sr-only">
              {HEADLINE.map((t) => t.text).join(" ")}
            </span>
            <span
              aria-hidden
              className="flex flex-wrap items-baseline gap-x-[0.25em] gap-y-1"
            >
              {HEADLINE.map((token, i) => (
                <motion.span
                  key={`${token.text}-${i}`}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={wordVariants}
                  className={
                    token.italic
                      ? "inline-block italic pr-[0.06em]"
                      : "inline-block"
                  }
                >
                  {token.text}
                </motion.span>
              ))}
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: HEADLINE_TOTAL_DELAY,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-10 max-w-[52ch] text-fluid-lg text-muted leading-relaxed"
          >
            Greyform is a small web studio in Lagos. We design and build
            sites for businesses that&rsquo;d rather be remembered than
            simply present.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: HEADLINE_TOTAL_DELAY + 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-12 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/start"
              data-cursor="hover"
              className="group inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3.5 font-mono text-fluid-xs uppercase tracking-[0.18em] text-bg transition-colors duration-300 hover:bg-bg hover:text-fg hover:ring-1 hover:ring-fg"
            >
              Start a Project
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
            </Link>

            <Link
              href="/work"
              data-cursor="hover"
              className="group inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-mono text-fluid-xs uppercase tracking-[0.18em] text-fg ring-1 ring-fg/40 transition-colors duration-300 hover:bg-fg hover:text-bg hover:ring-fg"
            >
              See the Work
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* RIGHT — Now panel */}
        <motion.aside
          ref={nowRef}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            delay: HEADLINE_TOTAL_DELAY + 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="col-span-12 lg:col-span-3 lg:pt-2 will-change-transform"
          aria-label="Currently"
        >
          <div className="rounded-lg border border-line bg-bg/40 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <span className="font-mono text-fluid-xs uppercase tracking-[0.18em] text-muted">
                Now / May 2026
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-fg/40" aria-hidden />
            </div>

            <ul className="mt-4 space-y-3">
              {NOW_ITEMS.map((item) => (
                <li
                  key={item.label}
                  className="flex items-start gap-3 font-mono text-fluid-xs leading-relaxed text-fg/90"
                >
                  <span
                    aria-hidden
                    className={
                      item.pulse
                        ? "mt-[0.55em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-fg pulse-dot"
                        : "mt-[0.55em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-muted/60"
                    }
                  />
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <style jsx>{`
            .pulse-dot {
              position: relative;
              box-shadow: 0 0 0 0 rgb(var(--fg) / 0.5);
              animation: pulse-ring 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            @keyframes pulse-ring {
              0% {
                box-shadow: 0 0 0 0 rgb(var(--fg) / 0.45);
              }
              70% {
                box-shadow: 0 0 0 8px rgb(var(--fg) / 0);
              }
              100% {
                box-shadow: 0 0 0 0 rgb(var(--fg) / 0);
              }
            }
          `}</style>
        </motion.aside>
      </div>
    </section>
  );
}
