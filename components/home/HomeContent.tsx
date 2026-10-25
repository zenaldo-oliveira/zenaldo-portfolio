"use client";

import { EntriesSection } from "@/components/home/sections/EntriesSection";
import { HeroSection } from "@/components/home/sections/HeroSection";
import { PathsSection } from "@/components/home/sections/PathsSection";
import { PreviewsSection } from "@/components/home/sections/PreviewsSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ReceivesSection } from "@/components/home/sections/ReceivesSection";
import { useTranslations } from "@/lib/i18n/LanguageContext";

// Home comercial: oferta e demonstração → três entradas → prévias reais →
// o que o cliente recebe → etapas de contratação → dois caminhos finais.
// Âncoras: #inicio, #entradas, #exemplos, #entrega, #processo, #contato.
export function HomeContent() {
  const h = useTranslations().commercial.home;

  return (
    <>
      <HeroSection />
      <EntriesSection />
      <PreviewsSection />
      <ReceivesSection />
      <ProcessSection steps={h.process.steps} eyebrow={h.process.eyebrow} title={h.process.title} />
      <PathsSection />
    </>
  );
}
