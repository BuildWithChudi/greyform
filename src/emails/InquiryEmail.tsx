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
  monoLabelStyle,
  sectionLabelStyle,
} from "./_shared";

export type InquiryEmailProps = {
  ref: string;
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

export function InquiryEmail({
  ref,
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
}: InquiryEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        {name} · {projectTypeLabel} · {budgetLabel}
      </Preview>
      <Body style={bodyStyle}>
        <Container style={cardStyle}>
          <Text style={monoLabelStyle}>Greyform / New inquiry</Text>

          <Heading
            as="h1"
            style={{
              fontSize: "28px",
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              color: colors.fg,
              margin: "16px 0 8px",
            }}
          >
            {name}
            {company ? ` · ${company}` : ""}
          </Heading>

          <Text style={{ fontSize: "14px", color: colors.muted, margin: 0 }}>
            {projectTypeLabel} · {timelineLabel} · {budgetLabel}
          </Text>

          <Hr style={{ borderColor: colors.line, margin: "28px 0" }} />

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

          <Hr style={{ borderColor: colors.line, margin: "28px 0 20px" }} />

          <Text style={monoLabelStyle}>
            Ref {ref} · {submittedAt}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default InquiryEmail;
