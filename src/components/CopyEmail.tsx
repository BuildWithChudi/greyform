"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

/**
 * The only interactive piece of the footer, isolated as a client island so the
 * rest of the footer can stay a server component (zero hydration cost).
 */
export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable (e.g. insecure context) — the mailto link below
         still works, so fail silently. */
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      data-cursor="hover"
      className="group inline-flex max-w-full items-baseline gap-3 text-left"
      aria-label={copied ? "Email copied" : `Copy email ${email}`}
    >
      <span
        className="min-w-0 break-words font-display italic leading-none tracking-tightest text-fg"
        style={{ fontSize: "clamp(1.75rem, 5vw, 3.75rem)" }}
      >
        {email}
      </span>
      <span
        className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line text-fg/60 transition-colors group-hover:border-fg group-hover:text-fg"
        aria-hidden
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </span>
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </button>
  );
}
