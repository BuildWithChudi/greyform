export type Faq = {
  question: string;
  answer: string;
};

// Single source for /services — feeds both the visible FAQ section and the
// FAQPage JSON-LD. The two MUST match word-for-word for Google to honour the
// rich result, so keep this file authoritative.
export const SERVICES_FAQS: readonly Faq[] = [
  {
    question:
      "Where is Greyform based, and do you work with clients outside Nigeria?",
    answer:
      "Greyform is based in Lagos, Nigeria, and works with clients globally. Time zone is GMT+1; we run async-friendly and reply within 48 hours.",
  },
  {
    question: "How much does a website from Greyform cost?",
    answer:
      "Custom websites start from £1,500 (about ₦2.4M). Redesigns start from £900 (about ₦1.4M). Web applications are quoted on scope after a discovery session.",
  },
  {
    question: "How long does a project take?",
    answer:
      "Most marketing sites ship in three to six weeks from kickoff. Redesigns are typically faster. Larger product builds are scoped per engagement.",
  },
  {
    question: "Do you use templates or themes?",
    answer:
      "No. Every site is designed from a blank file and hand-coded on Next.js, TypeScript, and Tailwind. The result is yours, performant, and easy to maintain.",
  },
  {
    question: "Who actually does the work?",
    answer:
      "Chudi Ofoma, Greyform's founder and creative director, leads design and engineering on every project. You speak to the person building the site.",
  },
];
