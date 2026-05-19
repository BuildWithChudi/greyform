import Hero from "@/components/sections/Hero";
import Philosophy from "@/components/sections/Philosophy";
import ServicesPreview from "@/components/sections/ServicesPreview";
import SelectedWork from "@/components/sections/SelectedWork";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Philosophy />
      <ServicesPreview />
      <SelectedWork />
      <FinalCTA />
    </>
  );
}
