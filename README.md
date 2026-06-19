# Greyform

Marketing site and lead pipeline for [Greyform](https://greyform.org), a Lagos
web design and development studio. The site presents the studio's work and
services, captures project inquiries through a guided form, and gives the owner
a private dashboard to triage those inquiries.

This document is written for a developer taking the project over. It covers how
to run it, how it is put together, where the content lives, and the few things
that are easy to get wrong.

---

## Stack

| Concern        | Choice                                                        |
| -------------- | ------------------------------------------------------------- |
| Framework      | Next.js 14 (App Router), React 18, TypeScript                 |
| Styling        | Tailwind CSS, CSS custom properties for theming               |
| Type / fonts   | Fraunces (display), Inter (sans), JetBrains Mono — `next/font` |
| Motion         | Framer Motion, GSAP + ScrollTrigger, Lenis (smooth scroll)    |
| Email          | Resend (React Email templates)                                |
| Database       | Supabase (Postgres) — inquiry storage and admin               |
| Analytics      | Vercel Analytics + Speed Insights                             |
| Hosting        | Vercel                                                        |

Requires **Node 20 LTS** (or 22). Node versions below 22 lack a global
`WebSocket`, which `@supabase/supabase-js` needs at construction time; the `ws`
package is wired in to cover that — see [Gotchas](#gotchas).

---

## Quick start

```bash
npm install
npm run dev
```

The dev server runs on `http://localhost:3000` (it falls back to `:3001` if 3000
is taken). The site renders without any environment variables; the inquiry form
and admin need them (below).

### Scripts

| Command         | Does                                                          |
| --------------- | ------------------------------------------------------------ |
| `npm run dev`   | Start the dev server with hot reload                          |
| `npm run build` | Production build, then generate `sitemap.xml` / `robots.txt` |
| `npm run start` | Serve the production build                                   |
| `npm run lint`  | ESLint (`next lint`)                                          |

`postbuild` runs `next-sitemap`, so the sitemap is always regenerated on build.

---

## Environment

Set these in `.env.local` for development, and in the Vercel project settings for
production. None are required to render the marketing pages; they gate the form
and admin.

| Variable                    | Required            | Purpose                                                                                     |
| --------------------------- | ------------------- | ------------------------------------------------------------------------------------------- |
| `RESEND_API_KEY`            | For the form        | Sends the inquiry and confirmation emails. Without it, `/api/inquiry` returns `503`.        |
| `INQUIRY_FROM_EMAIL`        | No                  | From address. Defaults to `Greyform <hello@greyform.org>`. Must be on a Resend-verified domain in production. |
| `INQUIRY_TO_EMAIL`          | No                  | Where inquiry notifications land. Defaults to `hello@greyform.org`.                          |
| `SUPABASE_URL`              | For storage + admin | Project URL, e.g. `https://<ref>.supabase.co`.                                              |
| `SUPABASE_SERVICE_ROLE_KEY` | For storage + admin | Service-role key. Server-only; bypasses RLS. Never expose to the client.                    |
| `ADMIN_PASSWORD`            | For `/admin`        | The single admin password. Login fails until this is set.                                   |
| `GOOGLE_SITE_VERIFICATION`  | No                  | Search Console token. A committed fallback exists; this overrides it.                       |
| `SITE_URL`                  | No                  | Used by `next-sitemap`. Defaults to `https://greyform.org`.                                 |

Email delivery and inquiry storage are independent. If Supabase is not
configured, the form still emails; it just does not persist. If Resend is not
configured, the form fails loudly and tells the visitor to email directly.

---

## Project structure

```
src/
  app/
    layout.tsx            Root layout: fonts, metadata, JSON-LD, theme pre-paint script, chrome
    page.tsx              Home — composes the homepage sections
    globals.css           Design tokens (CSS vars), dark mode, focus styles, film grain, Lenis classes
    error.tsx             Route-level error boundary
    global-error.tsx      Root error boundary
    not-found.tsx         404
    opengraph-image.tsx   Dynamic OG image (1200x630)

    work/
      page.tsx            /work index (metadata + breadcrumb JSON-LD)
      WorkIndex.tsx       Case-study list, alternating layout
      [slug]/
        page.tsx          Static params + per-case-study metadata and JSON-LD
        CaseStudyView.tsx Case-study layout (cover, narrative, gallery, testimonials)
    services/             /services (service blocks + FAQ, with Service + FAQPage JSON-LD)
    about/                /about
    start/
      page.tsx
      StartForm.tsx       Four-step inquiry form (react-hook-form + zod)
    admin/
      page.tsx            Gated server component: login wall or dashboard
      LoginForm.tsx       Password sign-in
      AdminTable.tsx      Dashboard: metrics, filters, search, status, notes, CSV export

    api/
      inquiry/route.ts            POST: validate, rate-limit, email (Resend), persist (Supabase)
      inquiries/[id]/route.ts     PATCH: update status/notes (admin-gated)
      admin/login/route.ts        POST: verify password, set signed cookie
      admin/logout/route.ts       POST: clear cookie
      ping/route.ts               GET (edge): health/latency probe; not currently used by the UI

  components/
    ClientChrome.tsx      Lazily mounts Cursor + SmoothScroll (client-only)
    MotionProvider.tsx    Framer MotionConfig with reducedMotion="user"
    Nav.tsx               Fixed header, blur on scroll, mobile sheet
    Footer.tsx            Server component; contact, directory, availability
    CopyEmail.tsx         Client island: copy-to-clipboard button used by the footer
    Cursor.tsx            Custom dot cursor (pointer devices only)
    SmoothScroll.tsx      Lenis driven by gsap.ticker
    ThemeToggle.tsx       system → light → dark
    MagneticLink.tsx      Pointer-follow hover wrapper
    JsonLd.tsx            Structured-data graph + per-page schema builders
    sections/             Homepage sections (Hero, Philosophy, ServicesPreview, SelectedWork, Testimonials, FinalCTA)

  data/
    work.ts               Case studies (the content model) + homepage testimonial aggregate
    services.ts           Service offerings
    faqs.ts               FAQ source (feeds both the visible list and FAQPage JSON-LD)

  emails/
    InquiryEmail.tsx      Notification template (to the studio)
    ConfirmationEmail.tsx Auto-reply template (to the visitor)
    _shared.tsx           Shared email styles and the FieldRow helper

  lib/
    admin-auth.ts         Signed-cookie session (HMAC), constant-time password check
    supabase.ts           Server-only Supabase client (service role)
    inquiry-types.ts      Inquiry row type + status constants (safe on client and server)
    schemas/inquiry.ts    Zod schema and option lists, shared by form and API
    theme.ts              useTheme hook + the FOUC-safe init script
    utils.ts              cn() class-name helper

supabase/
  migrations/0001_inquiries.sql   The inquiries table, indexes, RLS, status constraint
next.config.mjs                   Security headers + CSP, image allow-list
next-sitemap.config.js            Sitemap and robots generation
tailwind.config.ts                Fluid type scale, color tokens, fonts
```

---

## How it works

### Rendering

Pages are statically generated by default. `/work/[slug]` is pre-rendered per
case study via `generateStaticParams`. `/admin` and the API routes are dynamic.
The marketing pages carry no per-request state, so they cache well at the edge.

### Design system and theming

Colors are defined once as RGB-channel CSS variables in `globals.css`
(`--bg`, `--fg`, `--muted`, `--line`) and exposed to Tailwind as `bg`, `fg`,
`muted`, `line`. Because they are channels, alpha utilities such as `bg-fg/70`
work in both themes.

| Token | Light     | Dark      |
| ----- | --------- | --------- |
| bg    | `#FAFAFA` | `#0A0A0A` |
| fg    | `#0A0A0A` | `#FAFAFA` |
| muted | `#6B6B6B` | `#8A8A8A` |
| line  | `#E5E5E5` | `#1F1F1F` |

Dark mode is a `.dark` class on `<html>`. A small inline script in `layout.tsx`
(`themeInitScript` from `lib/theme.ts`) sets it before first paint to avoid a
flash. `ThemeToggle` cycles system → light → dark and persists the choice in
`localStorage`. Type sizes use a fluid `clamp()` scale (`text-fluid-*`) defined
in `tailwind.config.ts`; headlines that should wrap well use `.text-balance`.

### Motion

- **Smooth scroll** (`SmoothScroll.tsx`): Lenis is driven by `gsap.ticker` so
  scroll and scroll-triggered animation share one clock. Disabled on touch
  devices and under reduced motion.
- **Reveals and parallax**: Framer Motion for section reveals, GSAP +
  ScrollTrigger for the hero parallax. `MotionProvider` sets
  `reducedMotion="user"`, so Framer respects the OS setting.
- **Cursor** (`Cursor.tsx`): a custom dot, pointer devices only, hidden below
  `md` and under reduced motion. The global `cursor: none` rule applies only on
  fine-pointer, hover-capable devices.

Client-only chrome (cursor, smooth scroll) is code-split through `ClientChrome`
so it never runs during SSR.

### The inquiry pipeline

The path from `/start` to inbox and database:

1. `StartForm.tsx` collects four steps and validates with the zod schema in
   `lib/schemas/inquiry.ts` (the same schema the API uses). A hidden honeypot
   field (`website`) catches naive bots.
2. On submit it `POST`s JSON to `/api/inquiry`.
3. The route applies an in-memory per-IP rate limit (4/min), rejects oversized
   bodies, re-validates with the shared schema, then sends two emails through
   Resend in parallel: a notification to `INQUIRY_TO_EMAIL` and a confirmation to
   the visitor.
4. After the emails succeed, it makes a best-effort insert into the Supabase
   `inquiries` table. A storage failure is logged but does not fail the request,
   because the emails have already gone out.

Email templates live in `src/emails`. Styles are inlined for client
compatibility and shared through `_shared.tsx`.

### Admin

`/admin` is a server component. It calls `isAdminSession()`; unauthenticated
visitors get `LoginForm`, authenticated ones get `AdminTable` loaded with the 500
most recent inquiries.

Auth (`lib/admin-auth.ts`) is intentionally minimal for a single user: no JWT
library, no session table. Login verifies the password in constant time, then
issues a cookie of the form `<timestamp>.<hmac>`, where the HMAC is keyed by the
password itself. Expiry is encoded in the token (7 days). Because the key is the
password, changing `ADMIN_PASSWORD` invalidates every outstanding session. The
cookie is `HttpOnly`, `SameSite=strict`, and `Secure` in production. The login
route is rate-limited (5/min per IP).

The dashboard (`AdminTable.tsx`) provides:

- A metrics row: total, new (needs reply), this week, won, and an estimated open
  pipeline value derived from budget bands (directional only).
- Status filters with counts, and free-text search across name, email, company,
  and description.
- Per-inquiry detail with a one-click reply (mail client pre-filled with subject
  and greeting), copy-email, an editable status, and private notes. Status and
  notes save through `PATCH /api/inquiries/[id]`, which is admin-gated and
  validates the id as a UUID.
- CSV export of the current view.

### Security headers and CSP

`next.config.mjs` sets HSTS (preload), `X-Content-Type-Options`,
`X-Frame-Options`, `Referrer-Policy`, a restrictive `Permissions-Policy`,
`Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`, and a
Content-Security-Policy.

The CSP is static (not nonce-based) so pages stay statically generated. It
restricts script and object sources, `base-uri`, `frame-ancestors`, and
`form-action`. `script-src` allows `'unsafe-inline'`, which is the one deliberate
concession: the site renders no user-supplied HTML, so the practical XSS surface
is small, and a nonce would force every page to render per request. In
development the policy adds `'unsafe-eval'` and a websocket source for HMR and
drops `upgrade-insecure-requests` (which would break `http://localhost`).

### SEO and structured data

Metadata is defined per route. `JsonLd.tsx` holds a cross-linked schema graph
(Organization, Person, WebSite) plus builders for Service, FAQPage,
BreadcrumbList, and per-case-study CreativeWork. The graph is linked by `@id`, so
the studio and its founder resolve as one entity. The FAQ list in `data/faqs.ts`
is the single source for both the visible FAQ and the FAQPage schema; keep the
two in sync or the rich result is dropped. `next-sitemap` builds the sitemap and
robots file and excludes `/admin` and the API.

---

## Content

Most copy lives in typed data files; editing them is the normal way to update the
site.

### Case studies — `src/data/work.ts`

Each entry is a `CaseStudy`. The card fields (`client`, `title`, `summary`,
`cover`, `tags`, `liveUrl`) drive the index and homepage; the optional detail
fields (`problem`, `approach`, `outcome`, `gallery`, `testimonials`) drive the
case-study page. A case study with no detail fields renders a "writeup in
progress" stub automatically.

- **Add one**: append an object to `ALL_CASE_STUDIES`. New `cover` hosts must be
  added to `images.remotePatterns` in `next.config.mjs` and to `img-src` in the
  CSP. Current allow-list: `ik.imagekit.io/chewdee` and
  `res.cloudinary.com/dud5owpai`.
- **Drafts**: set `draft: true` to keep an entry out of every public list, route,
  and the sitemap until it is ready.
- **Testimonials**: `testimonials` is an ordered array. The first quote is
  featured on the homepage strip; the case-study page shows all of them. Add a
  quote and it appears in both places.

### Services — `src/data/services.ts`

Drives the `/services` page and the homepage preview. Pricing strings here should
match the Service JSON-LD offers in `JsonLd.tsx` if you change them.

### FAQs — `src/data/faqs.ts`

Single source for the `/services` FAQ section and its FAQPage schema.

---

## Database

Schema lives in `supabase/migrations/0001_inquiries.sql`. For a fresh project,
paste the file into the Supabase SQL editor and run it once (every statement is
idempotent).

The `inquiries` table stores the submission fields plus `status` (`new`,
`contacted`, `proposal_sent`, `won`, `lost`), free-text `notes`, and
`created_at`. Row-level security is enabled with no policies, so anon and
authenticated clients get nothing; the server reaches the table only with the
service-role key. A check constraint guards the `status` values.

---

## Deployment

The project deploys to Vercel as-is.

1. Set the environment variables (above) in the Vercel project. At minimum,
   `RESEND_API_KEY` for the form and `ADMIN_PASSWORD` for the dashboard; add the
   `SUPABASE_*` pair to persist inquiries.
2. Verify the sending domain in Resend so `INQUIRY_FROM_EMAIL` can send. An
   unverified domain produces a `502` from the form even though the code is fine.
3. Deploy. After the first deploy, submit a real inquiry to confirm both emails
   arrive and the row appears in `/admin`.

---

## Gotchas

- **Node and `ws`.** `@supabase/supabase-js` builds a realtime client on
  construction, which needs a global `WebSocket`. Node below 22 does not have one
  outside the browser, so `lib/supabase.ts` passes the `ws` package as the
  realtime transport. Realtime is never used; this only stops the client from
  throwing on Node 20. Keep `ws` installed.
- **CSP and inline scripts.** Because `script-src` uses `'unsafe-inline'`, moving
  to a strict nonce later also means moving to per-request rendering. If you add
  inline scripts from a new origin, update the CSP in `next.config.mjs`.
- **The customer-facing reference code is not stored.** `/api/inquiry` generates
  a short ref for the emails only; the admin shows a separate id-derived ref. If
  you need them to match, persist the generated ref and surface it in the table.
- **The "Now" date** in the hero panel is computed server-side in `page.tsx`. It
  is current as of each deploy; it does not tick in real time.
- **`/api/ping`** is a leftover health probe. The footer no longer uses it. Safe
  to keep or remove.
- **Rate limiting is in-memory**, so it resets per serverless instance. That is
  enough to slow casual spam. For stronger guarantees, back it with Upstash or
  Vercel KV.

---

## Conventions

- TypeScript throughout; data files are typed and treated as the content model.
- Server-only modules import `server-only` so they can never be pulled into a
  client bundle.
- Class names are composed with `cn()` (`clsx` + `tailwind-merge`).
- Run `npm run lint` before committing; the build also type-checks.
