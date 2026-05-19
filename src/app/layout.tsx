import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ClientChrome from "@/components/ClientChrome";
import MotionProvider from "@/components/MotionProvider";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { themeInitScript } from "@/lib/theme";
import {
  JsonLd,
  organizationSchema,
  websiteSchema,
} from "@/components/JsonLd";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const DEFAULT_TITLE = "Greyform · Web design & development studio, Lagos";
const DEFAULT_DESCRIPTION =
  "Greyform is a Lagos-based web design and development studio. We build distinctive, performant websites for businesses, schools, and creators. Working globally.";
const OG_ALT = "Greyform — web design & development studio, Lagos.";

// Google Search Console verification token. Not a secret — it ships in the
// rendered HTML by design. Env var overrides the committed value so a future
// re-verification can be done without a code change.
const googleVerification =
  process.env.GOOGLE_SITE_VERIFICATION ??
  "0SZeHnc-mTv_sn-qfa4VRt9-apwlhjk3VOsb5OlVMqo";

export const metadata: Metadata = {
  metadataBase: new URL("https://greyform.org"),
  title: {
    default: DEFAULT_TITLE,
    template: "%s · Greyform",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: "Greyform",
  authors: [{ name: "Chudi Ofoma", url: "https://greyform.org/about" }],
  creator: "Chudi Ofoma",
  publisher: "Greyform (KeyPass Solutions)",
  keywords: [
    "Greyform",
    "Greyform studio",
    "Greyform Lagos",
    "Chudi Ofoma",
    "web design studio Lagos",
    "web development Nigeria",
    "Next.js development studio",
    "premium website design Lagos",
    "Lagos web design agency",
    "editorial website design",
  ],
  category: "design",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    alternateLocale: ["en_GB", "en_US"],
    url: "https://greyform.org",
    siteName: "Greyform",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: OG_ALT,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    site: "@mrofoma",
    creator: "@mrofoma",
    images: [{ url: "/opengraph-image", alt: OG_ALT }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in env to emit the GSC meta tag.
  // Left undefined here so no broken placeholder ships to production.
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <JsonLd data={[organizationSchema, websiteSchema]} />
      </head>
      <body className="font-sans bg-bg text-fg antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-md focus:bg-fg focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-[0.18em] focus:text-bg"
        >
          Skip to content
        </a>
        <MotionProvider>
          <ClientChrome />
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </MotionProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
