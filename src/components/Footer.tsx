import Link from "next/link";
import CopyEmail from "./CopyEmail";

const EMAIL = "hello@greyform.org";
const PHONE_DISPLAY = "+234 706 220 0791";
const PHONE_TEL = "+2347062200791";
const WHATSAPP_URL = "https://wa.me/2347062200791";

const NAV_LINKS = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/start", label: "Start a project" },
];

// The studio's identity is Chudi's identity — link the profiles he actually
// runs. If you spin up a separate @greyform brand later, swap these in.
const SOCIAL_LINKS = [
  { href: "https://www.ochudi.com", label: "ochudi.com" },
  { href: "https://x.com/mrofoma", label: "X (Twitter)" },
  { href: "https://www.linkedin.com/in/ochudi", label: "LinkedIn" },
  { href: "https://instagram.com/mrofoma", label: "Instagram" },
  { href: "https://github.com/ochudi", label: "GitHub" },
];

const markHover =
  "inline-block h-px w-3 bg-fg/40 transition-[width,background-color] duration-300 group-hover:w-5 group-hover:bg-fg";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-line bg-bg">
      <div className="mx-auto max-w-[1400px] px-6 pt-20 pb-10 md:px-10 md:pt-28 md:pb-12">
        {/* Editorial top: tag + statement + email */}
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-12 md:gap-x-12">
          <div className="md:col-span-3">
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
              <span className="font-display italic tracking-tightest text-fg text-[1.5rem] leading-none">
                Greyform
              </span>
            </Link>
            <p className="mt-4 max-w-[24ch] text-fluid-sm leading-relaxed text-muted">
              Web design &amp; development studio. Lagos, working globally.
            </p>
          </div>

          <div className="md:col-span-9">
            <p
              className="max-w-[18ch] text-balance font-display tracking-tightest text-fg leading-[1.02]"
              style={{ fontSize: "clamp(2.25rem, 5vw, 4.25rem)" }}
            >
              Got something good in mind?{" "}
              <span className="italic text-muted">Let&rsquo;s build it.</span>
            </p>

            <div className="mt-8 md:mt-10">
              <CopyEmail email={EMAIL} />
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
                <a
                  href={`tel:${PHONE_TEL}`}
                  data-cursor="hover"
                  className="text-fg/85 transition-colors hover:text-fg"
                  aria-label={`Call ${PHONE_DISPLAY}`}
                >
                  {PHONE_DISPLAY}
                </a>
                <span aria-hidden className="inline-block h-px w-3 bg-line" />
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="text-fg/85 transition-colors hover:text-fg"
                >
                  WhatsApp
                </a>
              </div>
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
                    <span className={markHover} aria-hidden />
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
                    rel="noopener noreferrer me"
                    data-cursor="hover"
                    className="group inline-flex items-baseline gap-2 text-fluid-base text-fg/85 transition-colors hover:text-fg"
                  >
                    <span className={markHover} aria-hidden />
                    {l.label}
                    <span
                      aria-hidden
                      className="text-fg/40 transition-colors group-hover:text-fg"
                    >
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 md:col-span-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
              Availability
            </p>
            <ul className="mt-4 space-y-2.5 text-fluid-base text-fg/85">
              <li className="flex items-baseline gap-2">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full bg-fg"
                  aria-hidden
                />
                Booking new projects
              </li>
              <li className="text-muted">Replies within 48 hours</li>
              <li className="text-muted">Working globally · GMT+1</li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-line pt-6 md:flex-row md:items-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            © {year} · Greyform · KeyPass Solutions
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            Designed &amp; built in Lagos
          </p>
        </div>
      </div>
    </footer>
  );
}
