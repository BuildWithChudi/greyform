# Greyform

Marketing site for [Greyform](https://greyform.org) — web design & development by Chudi Ofoma. Lagos. Working globally.

## Stack

- Next.js 14 (App Router) · TypeScript · Tailwind
- Fraunces (display) · Inter (sans) · JetBrains Mono — via `next/font/google`
- Framer Motion · GSAP + ScrollTrigger · Lenis (smooth scroll synced to `gsap.ticker`)
- Resend (forms) · Vercel Analytics + Speed Insights

## Develop

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## Layout

```
src/
  app/
    api/ping/         edge route for the footer latency indicator
    layout.tsx        fonts, metadata, JSON-LD, theme pre-paint script
    page.tsx          home — composes the sections below
    globals.css       CSS-var design tokens, dark override, Lenis classes
  components/
    Cursor.tsx        custom dot cursor (mix-blend: difference)
    Footer.tsx        contact, links, social, live latency indicator
    MagneticLink.tsx  hover magnet wrapper
    Nav.tsx           fixed nav, blur on scroll
    SmoothScroll.tsx  Lenis + gsap.ticker sync, off on touch
    ThemeToggle.tsx   system → light → dark
    sections/         page-level sections (Hero, Philosophy, …)
  lib/
    theme.ts          useTheme + FOUC-safe init script
    utils.ts          cn()
public/
  favicon assets, site.webmanifest
```

## Design tokens

Defined as CSS variables in [`globals.css`](src/app/globals.css), driven by a `.dark` class on `<html>`:

| Token | Light       | Dark        |
| ----- | ----------- | ----------- |
| bg    | `#FAFAFA`   | `#0A0A0A`   |
| fg    | `#0A0A0A`   | `#FAFAFA`   |
| muted | `#6B6B6B`   | `#8A8A8A`   |
| line  | `#E5E5E5`   | `#1F1F1F`   |

Tailwind reads them via `rgb(var(--x) / <alpha-value>)`, so `bg-bg/70` etc. work in both modes.
