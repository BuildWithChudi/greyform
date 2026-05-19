import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CASE_STUDIES,
  getCaseStudy,
  getCaseStudyIndex,
  getNextCaseStudy,
} from "@/data/work";
import {
  JsonLd,
  breadcrumbSchema,
  caseStudySchema,
} from "@/components/JsonLd";
import CaseStudyView from "./CaseStudyView";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return CASE_STUDIES.map((cs) => ({ slug: cs.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const cs = getCaseStudy(params.slug);
  if (!cs) return {};
  const url = `https://greyform.org/work/${cs.slug}`;
  return {
    title: cs.client,
    description: cs.summary,
    alternates: { canonical: `/work/${cs.slug}` },
    openGraph: {
      title: `${cs.client} · Greyform`,
      description: cs.summary,
      url,
      images: [{ url: cs.cover, alt: cs.coverAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${cs.client} · Greyform`,
      description: cs.summary,
      images: [cs.cover],
    },
  };
}

export default function CaseStudyPage({ params }: { params: Params }) {
  const cs = getCaseStudy(params.slug);
  if (!cs) notFound();

  const index = getCaseStudyIndex(params.slug);
  const next = getNextCaseStudy(params.slug);

  const crumbs = breadcrumbSchema([
    { name: "Home", item: "https://greyform.org" },
    { name: "Work", item: "https://greyform.org/work" },
    { name: cs.client, item: `https://greyform.org/work/${cs.slug}` },
  ]);
  const work = caseStudySchema({
    slug: cs.slug,
    client: cs.client,
    title: cs.title,
    summary: cs.summary,
    year: cs.year,
    cover: cs.cover,
    liveUrl: cs.liveUrl,
  });

  return (
    <>
      <JsonLd data={[crumbs, work]} />
      <CaseStudyView cs={cs} indexNumber={index + 1} next={next} />
    </>
  );
}
