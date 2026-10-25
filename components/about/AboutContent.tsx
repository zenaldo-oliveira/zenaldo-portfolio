"use client";

import { AboutFounder } from "@/components/about/AboutFounder";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutProof } from "@/components/about/AboutProof";
import { AboutTech } from "@/components/about/AboutTech";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { useTranslations } from "@/lib/i18n/LanguageContext";

export function AboutContent() {
  const t = useTranslations();

  return (
    <>
      {/* Apresentação da ZTech e do público que atende */}
      <AboutHero />

      {/* Quem está por trás da empresa */}
      <AboutFounder />

      {/* Projetos reais desenvolvidos */}
      <AboutProof />

      {/* Como funciona o trabalho */}
      <ProcessSection />

      {/* Capacidade técnica */}
      <AboutTech />

      {/* Próximo passo para contratar */}
      <FinalCtaSection
        title={t.about.finalCta.title}
        subtitle={t.about.finalCta.subtitle}
      />
    </>
  );
}
