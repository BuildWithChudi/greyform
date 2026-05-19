import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Greyform · Web design & development from Lagos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0A0A0A";
const FG = "#FAFAFA";
const MUTED = "#8A8A8A";
const DIM = "#A5A5A5";

const WORDMARK = "GREYFORM";
const KICKER = "GREYFORM / STUDIO";
const TAGLINE = "Web design & development.";
const LOCATION = "Lagos. Working globally.";
const URL_LABEL = "greyform.org";

/**
 * Fetch a Fraunces font binary at edge runtime by parsing the URL out of the
 * Google Fonts CSS response. The Firefox 68 User-Agent forces a TTF response,
 * which @vercel/og accepts; the modern UA returns woff2 which it does not.
 *
 * We subset the font to just the characters used in the OG image so the
 * download stays tiny (well under 30KB instead of ~150KB for the full file).
 */
async function loadFraunces(
  text: string,
  weight: number
): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=Fraunces:wght@${weight}&text=${encodeURIComponent(
      text
    )}`;
    const css = await (
      await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:68.0) Gecko/20100101 Firefox/68.0",
        },
      })
    ).text();
    const match = css.match(/url\((https:\/\/[^)]+)\) format/);
    if (!match) return null;
    return await (await fetch(match[1])).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const subsetText = Array.from(
    new Set(
      [WORDMARK, KICKER, TAGLINE, LOCATION, URL_LABEL].join("").split("")
    )
  ).join("");

  const fontMedium = await loadFraunces(subsetText, 500);

  const fonts = fontMedium
    ? [
        {
          name: "Fraunces",
          data: fontMedium,
          style: "normal" as const,
          weight: 500 as const,
        },
      ]
    : undefined;

  const serif = fontMedium ? "Fraunces" : "Georgia, serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          color: FG,
          padding: "72px 80px",
          fontFamily: serif,
        }}
      >
        {/* Top hairline + kicker */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "monospace",
            fontSize: 20,
            letterSpacing: "0.22em",
            color: MUTED,
            textTransform: "uppercase",
          }}
        >
          <span>{KICKER}</span>
          <span>2026</span>
        </div>

        {/* Center: wordmark */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: serif,
              fontSize: 220,
              lineHeight: 1,
              letterSpacing: "-0.04em",
              color: FG,
            }}
          >
            {WORDMARK}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 32,
              fontFamily: serif,
              fontSize: 38,
              lineHeight: 1.25,
              letterSpacing: "-0.01em",
              color: DIM,
            }}
          >
            <span>{TAGLINE}</span>
            <span>{LOCATION}</span>
          </div>
        </div>

        {/* Bottom hairline + URL */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "monospace",
            fontSize: 20,
            letterSpacing: "0.22em",
            color: MUTED,
            textTransform: "uppercase",
          }}
        >
          <span>Studio · Lagos</span>
          <span>{URL_LABEL}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    }
  );
}
