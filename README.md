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

## Environment

Copy `.env.local.example` (if present) or set these in `.env.local`:

```bash
# Required for /api/inquiry to send mail. Without it the endpoint returns 503.
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx

# Optional. Defaults to "Greyform <hello@greyform.org>" / "hello@greyform.org".
# In production, the FROM address must be on a domain you've verified in Resend.
# For dev you can use "onboarding@resend.dev".
INQUIRY_FROM_EMAIL="Greyform <hello@greyform.org>"
INQUIRY_TO_EMAIL="hello@greyform.org"
```

## Layout

```
src/
  app/
    api/
      ping/           edge route for the footer latency indicator
      inquiry/        POST handler for the start-a-project form (Resend)
    start/            multi-step inquiry form
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
  emails/
    InquiryEmail.tsx  React Email template for the notification mail
  lib/
    schemas/          zod schemas (inquiry, …)
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
