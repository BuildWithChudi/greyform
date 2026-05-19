"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while menu is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape closes menu.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500",
          scrolled || open
            ? "bg-bg/80 backdrop-blur-md border-b border-line/50"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10 md:py-5"
        >
          <Link
            href="/"
            data-cursor="hover"
            aria-label="Greyform, home"
            className="group inline-flex items-baseline gap-2"
          >
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-fg transition-transform duration-500 group-hover:scale-150"
            />
            <span className="font-display italic tracking-tightest text-fg text-[1.35rem] md:text-[1.55rem] leading-none">
              Greyform
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-10">
            <ul className="flex items-center gap-8">
              {LINKS.map((l) => {
                const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      data-cursor="hover"
                      className={cn(
                        "group relative inline-block font-mono text-[11px] uppercase tracking-[0.22em] transition-colors duration-300",
                        active ? "text-fg" : "text-fg/55 hover:text-fg"
                      )}
                    >
                      {l.label}
                      <span
                        aria-hidden
                        className={cn(
                          "pointer-events-none absolute -bottom-1.5 left-0 h-px bg-fg origin-left transition-transform duration-500",
                          active
                            ? "w-full scale-x-100"
                            : "w-full scale-x-0 group-hover:scale-x-100"
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-3">
              <Link
                href="/start"
                data-cursor="hover"
                className="group inline-flex items-center gap-2 rounded-full border border-fg/15 bg-fg px-5 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.22em] text-bg transition-all duration-300 hover:border-fg hover:bg-bg hover:text-fg"
              >
                Start a project
                <span
                  aria-hidden
                  className="inline-block h-1 w-1 rounded-full bg-bg transition-colors duration-300 group-hover:bg-fg"
                />
              </Link>
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile trigger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            data-cursor="hover"
            className="md:hidden inline-flex h-10 w-10 items-center justify-center"
          >
            <span aria-hidden className="relative block h-3 w-6">
              <span
                className={cn(
                  "absolute left-0 right-0 top-0 h-px bg-fg transition-transform duration-500",
                  open && "translate-y-[6px] rotate-45"
                )}
              />
              <span
                className={cn(
                  "absolute left-0 right-0 bottom-0 h-px bg-fg transition-transform duration-500",
                  open && "-translate-y-[6px] -rotate-45"
                )}
              />
            </span>
          </button>
        </nav>
      </header>

      {/* Mobile menu sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease }}
            className="fixed inset-0 z-40 md:hidden bg-bg"
          >
            <div className="flex h-full flex-col px-6 pt-24 pb-10">
              <ul className="flex flex-col">
                {LINKS.map((l, i) => {
                  const active =
                    pathname === l.href || pathname.startsWith(`${l.href}/`);
                  return (
                    <motion.li
                      key={l.href}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.06, duration: 0.6, ease }}
                      className="border-b border-line"
                    >
                      <Link
                        href={l.href}
                        className={cn(
                          "flex items-baseline justify-between py-5 font-display tracking-tightest leading-none",
                          active ? "text-fg" : "text-fg/85"
                        )}
                        style={{ fontSize: "clamp(2.25rem, 9vw, 3rem)" }}
                      >
                        <span>{l.label}</span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.6, ease }}
                className="mt-10"
              >
                <Link
                  href="/start"
                  className="inline-flex w-full items-center justify-between rounded-full bg-fg px-6 py-4 font-mono text-[11px] uppercase tracking-[0.22em] text-bg"
                >
                  Start a project
                  <span aria-hidden>↗</span>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.36, duration: 0.6, ease }}
                className="mt-auto flex items-end justify-between gap-6 pt-12"
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                    Contact
                  </p>
                  <a
                    href="mailto:hello@greyform.org"
                    className="mt-2 block text-fluid-base text-fg underline underline-offset-4 decoration-fg/30"
                  >
                    hello@greyform.org
                  </a>
                  <a
                    href="tel:+2347062200791"
                    className="mt-1 block text-fluid-base text-fg/85 underline underline-offset-4 decoration-fg/20"
                  >
                    +234 706 220 0791
                  </a>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                    Lagos · NG · WhatsApp
                  </p>
                </div>
                <ThemeToggle />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
