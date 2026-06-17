import Hero from "@/components/sections/Hero";
import Philosophy from "@/components/sections/Philosophy";
import ServicesPreview from "@/components/sections/ServicesPreview";
import SelectedWork from "@/components/sections/SelectedWork";
import Testimonials from "@/components/sections/Testimonials";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  // Computed server-side so the "Now" panel never shows a stale hardcoded
  // month. Under per-request (dynamic) rendering this is always current; under
  // static rendering it's as fresh as the last deploy — either way, no rot.
  const now = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "Africa/Lagos",
  });

  return (
    <>
      <Hero now={now} />
      <Philosophy />
      <ServicesPreview />
      <SelectedWork />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
