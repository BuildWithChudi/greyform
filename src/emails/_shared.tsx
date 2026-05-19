import { Text } from "@react-email/components";

export const colors = {
  bg: "#FAFAFA",
  fg: "#0A0A0A",
  muted: "#6B6B6B",
  line: "#E5E5E5",
};

export const fonts = {
  sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  display: '"Fraunces", Georgia, "Times New Roman", serif',
  mono:
    '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
};

export const bodyStyle = {
  backgroundColor: colors.bg,
  color: colors.fg,
  fontFamily: fonts.sans,
  margin: 0,
  padding: "32px 0",
};

export const cardStyle = {
  maxWidth: "560px",
  margin: "0 auto",
  padding: "40px",
  backgroundColor: "#FFFFFF",
  border: `1px solid ${colors.line}`,
  borderRadius: "8px",
};

export const monoLabelStyle = {
  fontFamily: fonts.mono,
  fontSize: "11px",
  letterSpacing: "0.18em",
  textTransform: "uppercase" as const,
  color: colors.muted,
  margin: 0,
};

export const sectionLabelStyle = {
  fontFamily: fonts.mono,
  fontSize: "11px",
  letterSpacing: "0.16em",
  textTransform: "uppercase" as const,
  color: colors.muted,
  margin: "0 0 6px",
};

export const fieldValueBlockStyle = {
  fontSize: "15px",
  lineHeight: 1.55,
  color: colors.fg,
  margin: 0,
  whiteSpace: "pre-wrap" as const,
};

export function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <Text
        style={{
          fontFamily: fonts.mono,
          fontSize: "11px",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: colors.muted,
          margin: "0 0 2px",
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: "15px",
          lineHeight: 1.4,
          color: colors.fg,
          margin: 0,
        }}
      >
        {value}
      </Text>
    </div>
  );
}
