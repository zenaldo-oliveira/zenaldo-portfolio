import { AiSection } from "@/components/home/sections/AiSection";
import { CapabilitiesStrip } from "@/components/home/sections/CapabilitiesStrip";
import { CasesSection } from "@/components/home/sections/CasesSection";
import { FinalCtaSection } from "@/components/home/sections/FinalCtaSection";
import { HeroSection } from "@/components/home/sections/HeroSection";
import { ProblemsSection } from "@/components/home/sections/ProblemsSection";
import { ProcessSection } from "@/components/home/sections/ProcessSection";
import { ProductSpotlightSection } from "@/components/home/sections/ProductSpotlightSection";
import { SolutionsSection } from "@/components/home/sections/SolutionsSection";
import { TechnologiesSection } from "@/components/home/sections/TechnologiesSection";

// Orquestrador da Home: só define a ordem das seções. Âncoras: #inicio,
// #capacidades, #problemas, #solucoes, #produto, #cases, #processo,
// #tecnologias, #ia, #contato.
export function HomeContent() {
  return (
    <>
      <HeroSection />
      <CapabilitiesStrip />
      <ProblemsSection />
      <SolutionsSection />
      <ProductSpotlightSection />
      <CasesSection />
      <ProcessSection />
      <TechnologiesSection />
      <AiSection />
      <FinalCtaSection />
    </>
  );
}
