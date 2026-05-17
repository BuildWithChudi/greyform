"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import MagneticLink from "./MagneticLink";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";

const links = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "backdrop-blur-md bg-bg/70 border-b border-line/60"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
        <Link
          href="/"
          data-cursor="hover"
          className="font-display italic text-fluid-xl tracking-tightest text-fg"
        >
          Greyform
        </Link>

        <div className="flex items-center gap-1 md:gap-2">
          {links.map((l) => (
            <MagneticLink
              key={l.href}
              href={l.href}
              className="px-3 py-2 text-fluid-sm text-fg/80 hover:text-fg"
            >
              {l.label}
            </MagneticLink>
          ))}
          <MagneticLink
            href="/start"
            className="ml-2 rounded-full bg-fg px-4 py-2 text-fluid-sm font-medium text-bg"
          >
            Start a Project
          </MagneticLink>
          <ThemeToggle className="ml-2" />
        </div>
      </nav>
    </header>
  );
}
