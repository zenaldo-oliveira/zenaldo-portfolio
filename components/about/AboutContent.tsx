"use client";

import { AboutFounder } from "@/components/about/AboutFounder";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutProof } from "@/components/about/AboutProof";
import { AboutTech } from "@/components/about/AboutTech";
import { FinalCtaSection } from "@/components/home/sections/FinalCtaSection";
import { ProcessSection } from "@/components/home/sections/ProcessSection";
import { SolutionsSection } from "@/components/home/sections/SolutionsSection";
import { useTranslations } from "@/lib/i18n/LanguageContext";

// /about institucional: a empresa é a protagonista e o fundador aparece como
// prova de quem está por trás. Ordem: o que é a ZTech → o que faz → como
// trabalha → o que já construiu → quem está por trás → capacidade técnica →
// como contratar. Reaproveita as seções da Home (soluções, processo, CTA).
export function AboutContent() {
  const t = useTranslations();

  return (
    <>
      <AboutHero />
      <SolutionsSection eyebrow={t.about.whatWeDoEyebrow} />
      <ProcessSection />
      <AboutProof />
      <AboutFounder />
      <AboutTech />
      <FinalCtaSection title={t.about.finalCta.title} subtitle={t.about.finalCta.subtitle} />
    </>
  );
}
