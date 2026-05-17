"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Check } from "lucide-react";

const EMAIL = "hello@greyform.org";

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
      className="group inline-flex items-center gap-2 text-fluid-lg text-fg hover:opacity-80"
      aria-label={`Copy email ${EMAIL}`}
    >
      <span>{EMAIL}</span>
      {copied ? (
        <Check className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4 opacity-50 group-hover:opacity-100" />
      )}
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
    const id = setInterval(ping, 8000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <span className="inline-flex items-center gap-2 font-mono text-fluid-xs text-muted">
      <span
        className="inline-block h-1.5 w-1.5 rounded-full bg-fg"
        style={{ animation: "pulse 1.6s ease-in-out infinite" }}
      />
      Latency: {ms === null ? "—" : `${ms}ms`}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </span>
  );
}

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-line bg-bg">
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="font-mono text-fluid-xs uppercase tracking-widest text-muted">
              Contact
            </p>
            <div className="mt-4 space-y-2">
              <CopyEmail />
              <p className="text-fluid-sm text-muted">Lagos, Nigeria</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-fluid-xs uppercase tracking-widest text-muted">
              Links
            </p>
            <ul className="mt-4 space-y-2">
              {[
                { href: "/work", label: "Work" },
                { href: "/services", label: "Services" },
                { href: "/about", label: "About" },
                { href: "/start", label: "Start a Project" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    data-cursor="hover"
                    className="text-fluid-base text-fg hover:opacity-70"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-fluid-xs uppercase tracking-widest text-muted">
              Social
            </p>
            <ul className="mt-4 space-y-2">
              {[
                { href: "https://twitter.com/greyform", label: "Twitter / X" },
                { href: "https://instagram.com/greyform", label: "Instagram" },
                { href: "https://github.com/greyform", label: "GitHub" },
                { href: "https://read.cv/greyform", label: "Read.cv" },
              ].map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="hover"
                    className="text-fluid-base text-fg hover:opacity-70"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 md:flex-row md:items-center">
          <p className="font-mono text-fluid-xs text-muted">
            Greyform — KeyPass Solutions · Lagos · © 2026
          </p>
          <Latency />
        </div>
      </div>
    </footer>
  );
}
