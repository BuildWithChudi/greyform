"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Check } from "lucide-react";

const EMAIL = "hello@greyform.org";

const NAV_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/start", label: "Start a project" },
];

const SOCIAL_LINKS = [
  { href: "https://twitter.com/greyform", label: "Twitter / X" },
  { href: "https://instagram.com/greyform", label: "Instagram" },
  { href: "https://github.com/greyform", label: "GitHub" },
  { href: "https://read.cv/greyform", label: "Read.cv" },
];

function CopyEmail() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* noop */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      data-cursor="hover"
      className="group inline-flex items-baseline gap-3 text-left"
      aria-label={`Copy email ${EMAIL}`}
    >
      <span className="font-display tracking-tightest text-fg leading-none italic" style={{ fontSize: "clamp(2rem, 5vw, 3.75rem)" }}>
        {EMAIL}
      </span>
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-line text-fg/60 transition-colors group-hover:border-fg group-hover:text-fg" aria-hidden>
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}

function Latency() {
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const ping = async () => {
      const start = performance.now();
      try {
        await fetch("/api/ping", { cache: "no-store" });
        if (!cancelled) setMs(Math.round(performance.now() - start));
      } catch {
        if (!cancelled) setMs(null);
      }
    };

    ping();
    const id = setInterval(ping, 12000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
      <span
        className="inline-block h-1.5 w-1.5 rounded-full bg-fg/80"
        style={{ animation: "pulse 1.8s ease-in-out infinite" }}
        aria-hidden
      />
      <span>
        Latency · {ms === null ? "…" : `${ms}ms`}
      </span>
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
      `}</style>
    </span>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-line bg-bg">
      <div className="mx-auto max-w-[1400px] px-6 pt-20 pb-10 md:px-10 md:pt-28 md:pb-12">
        {/* Editorial top: tag + statement + email */}
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-12 md:gap-x-12">
          <div className="md:col-span-2">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              Greyform / Studio
            </p>
          </div>

          <div className="md:col-span-10">
            <p
              className="max-w-[20ch] font-display tracking-tightest text-fg leading-[1.02]"
              style={{ fontSize: "clamp(2.25rem, 5vw, 4.25rem)" }}
            >
              Got something good in mind? <span className="italic text-muted">Let&rsquo;s build it.</span>
            </p>

            <div className="mt-8 md:mt-10">
              <CopyEmail />
            </div>
          </div>
        </div>

        {/* Hairline divider */}
        <div className="mt-16 h-px w-full bg-line md:mt-24" />

        {/* Column directory */}
        <div className="mt-12 grid grid-cols-2 gap-y-12 gap-x-8 md:mt-14 md:grid-cols-12 md:gap-x-12">
          <div className="col-span-2 md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              Studio
            </p>
            <address className="mt-4 not-italic text-fluid-base text-fg/85 leading-relaxed">
              Greyform<br />
              An operating studio of<br />
              KeyPass Solutions<br />
              <span className="text-muted">Lagos, Nigeria</span>
            </address>
          </div>

          <div className="md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              Site
            </p>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    data-cursor="hover"
                    className="group inline-flex items-baseline gap-2 text-fluid-base text-fg/85 transition-colors hover:text-fg"
                  >
                    <span className="inline-block h-px w-3 bg-fg/40 transition-[width,background-color] duration-300 group-hover:w-5 group-hover:bg-fg" aria-hidden />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              Elsewhere
            </p>
            <ul className="mt-4 space-y-2.5">
              {SOCIAL_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="hover"
                    className="group inline-flex items-baseline gap-2 text-fluid-base text-fg/85 transition-colors hover:text-fg"
                  >
                    <span className="inline-block h-px w-3 bg-fg/40 transition-[width,background-color] duration-300 group-hover:w-5 group-hover:bg-fg" aria-hidden />
                    {l.label}
                    <span aria-hidden className="text-fg/40 group-hover:text-fg transition-colors">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              Now
            </p>
            <ul className="mt-4 space-y-2.5 text-fluid-base text-fg/85">
              <li className="flex items-baseline gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-fg" aria-hidden />
                Booking from July 2026
              </li>
              <li className="text-muted">Replies within 48 hours</li>
              <li className="text-muted">Working globally · GMT+1</li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 md:flex-row md:items-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            © {year} · Greyform · KeyPass Solutions
          </p>
          <Latency />
        </div>
      </div>
    </footer>
  );
}
