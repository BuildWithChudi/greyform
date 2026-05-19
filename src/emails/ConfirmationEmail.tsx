import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import {
  FieldRow,
  bodyStyle,
  cardStyle,
  colors,
  fieldValueBlockStyle,
  fonts,
  monoLabelStyle,
  sectionLabelStyle,
} from "./_shared";

export type ConfirmationEmailProps = {
  ref: string;
  firstName: string;
  name: string;
  email: string;
  company?: string;
  location?: string;
  projectTypeLabel: string;
  timelineLabel: string;
  budgetLabel: string;
  description: string;
  references?: string;
  submittedAt: string;
};

export function ConfirmationEmail({
  ref,
  firstName,
  name,
  email,
  company,
  location,
  projectTypeLabel,
  timelineLabel,
  budgetLabel,
  description,
  references,
  submittedAt,
}: ConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Got it, {firstName}. We&rsquo;ll reply within 48 hours.
      </Preview>
      <Body style={bodyStyle}>
        <Container style={cardStyle}>
          <Text style={monoLabelStyle}>Greyform / Received</Text>

          <Heading
            as="h1"
            style={{
              fontFamily: fonts.display,
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "34px",
              lineHeight: 1.1,
              letterSpacing: "-0.015em",
              color: colors.fg,
              margin: "20px 0 0",
            }}
          >
            Got it. Talk soon.
          </Heading>

          <Text
            style={{
              fontSize: "16px",
              lineHeight: 1.6,
              color: colors.fg,
              margin: "20px 0 0",
            }}
          >
            Hi {firstName}, thanks for reaching out. We&rsquo;ve got your
            inquiry and will reply within 48 hours.
          </Text>

          <Text
            style={{
              fontSize: "15px",
              lineHeight: 1.55,
              color: colors.muted,
              margin: "12px 0 0",
            }}
          >
            Below is a copy of what you sent, in case it&rsquo;s useful for your
            records.
          </Text>

          <Hr style={{ borderColor: colors.line, margin: "32px 0 28px" }} />

          <Text style={{ ...monoLabelStyle, marginBottom: "16px" }}>
            Your inquiry
          </Text>

          <Section>
            <FieldRow
              label="From"
              value={`${name}${company ? ` (${company})` : ""}`}
            />
            <FieldRow label="Email" value={email} />
            {location ? <FieldRow label="Location" value={location} /> : null}
          </Section>

          <Hr style={{ borderColor: colors.line, margin: "24px 0" }} />

          <Section>
            <FieldRow label="Project type" value={projectTypeLabel} />
            <FieldRow label="Timeline" value={timelineLabel} />
            <FieldRow label="Budget" value={budgetLabel} />
          </Section>

          <Hr style={{ borderColor: colors.line, margin: "24px 0" }} />

          <Section>
            <Text style={sectionLabelStyle}>Description</Text>
            <Text style={fieldValueBlockStyle}>{description}</Text>

            {references ? (
              <>
                <Text style={{ ...sectionLabelStyle, marginTop: "20px" }}>
                  References
                </Text>
                <Text style={fieldValueBlockStyle}>{references}</Text>
              </>
            ) : null}
          </Section>

          <Hr style={{ borderColor: colors.line, margin: "32px 0 24px" }} />

          <Text
            style={{
              fontSize: "16px",
              lineHeight: 1.55,
              color: colors.fg,
              margin: 0,
            }}
          >
            The Greyform team
          </Text>

          <Text style={{ ...monoLabelStyle, marginTop: "20px" }}>
            Ref {ref} · {submittedAt}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default ConfirmationEmail;
