"use client";

import { useEffect } from "react";

/**
 * Last-resort fallback for errors thrown inside the root layout itself.
 * Tailwind, fonts, theme, Nav, Footer — none of it is guaranteed here, so this
 * file ships its own minimal inline styles. Keep it bulletproof: no imports
 * from the rest of the app, no external assets, no theme tokens.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app/global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#0A0A0A",
          color: "#FAFAFA",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          WebkitFontSmoothing: "antialiased",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
        }}
      >
        <main style={{ maxWidth: 640, width: "100%" }}>
          <p
            style={{
              margin: 0,
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 12,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#8A8A8A",
            }}
          >
            Greyform / Error
          </p>

          <h1
            style={{
              margin: "32px 0 0",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 500,
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.04em",
            }}
          >
            Something went{" "}
            <em
              style={{
                fontStyle: "italic",
                color: "#A5A5A5",
              }}
            >
              wrong
            </em>
            .
          </h1>

          <p
            style={{
              margin: "40px 0 0",
              maxWidth: "52ch",
              fontSize: 18,
              lineHeight: 1.6,
              color: "#A5A5A5",
            }}
          >
            The site hit an unexpected error. Try again — and if it keeps
            happening, email{" "}
            <a
              href="mailto:hello@greyform.org"
              style={{
                color: "#FAFAFA",
                textDecoration: "underline",
                textUnderlineOffset: 4,
                textDecorationColor: "rgba(250, 250, 250, 0.3)",
              }}
            >
              hello@greyform.org
            </a>
            .
          </p>

          <div
            style={{
              marginTop: 48,
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                appearance: "none",
                cursor: "pointer",
                border: "1px solid #FAFAFA",
                background: "#FAFAFA",
                color: "#0A0A0A",
                padding: "14px 24px",
                borderRadius: 999,
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Try again
            </button>

            <a
              href="/"
              style={{
                display: "inline-block",
                border: "1px solid rgba(250, 250, 250, 0.4)",
                background: "transparent",
                color: "#FAFAFA",
                padding: "14px 24px",
                borderRadius: 999,
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Back home
            </a>
          </div>

          {error.digest && (
            <p
              style={{
                marginTop: 64,
                paddingTop: 24,
                borderTop: "1px solid #1F1F1F",
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#8A8A8A",
              }}
            >
              Ref ·{" "}
              <span style={{ color: "rgba(250, 250, 250, 0.85)" }}>
                {error.digest}
              </span>
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
