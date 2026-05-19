import type { Metadata } from "next";
import StartForm from "./StartForm";

export const metadata: Metadata = {
  title: "Start a Project",
  description:
    "Tell us about your project. Four short steps, two minutes. We reply within 48 hours with a clear next step. Greyform · Web design & development studio.",
  alternates: { canonical: "/start" },
  openGraph: {
    title: "Start a Project · Greyform",
    description:
      "Tell us about your project. Four short steps, two minutes. We reply within 48 hours.",
    url: "https://greyform.org/start",
  },
  twitter: {
    title: "Start a Project · Greyform",
    description:
      "Tell us about your project. Four short steps, two minutes. We reply within 48 hours.",
  },
};

export default function StartPage() {
  return <StartForm />;
}
