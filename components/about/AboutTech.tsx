"use client";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useTranslations } from "@/lib/i18n/LanguageContext";

// Tecnologias como capacidade: uma "ficha técnica" em grade (nome + área),
// sem logos e sem chips. Divisórias de 1px via gap sobre o fundo da borda.
export function AboutTech() {
  const t = useTranslations();
  const tech = t.about.tech;

  return (
    <Section id="tecnologias">
      <Container>
        <SectionHeader eyebrow={tech.eyebrow} title={tech.title} description={tech.description} />

        <Reveal>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
            {tech.items.map((item) => (
              <div key={item.name} className="bg-surface p-5 sm:p-6">
                <dt className="text-lg font-semibold tracking-tight text-text-primary">{item.name}</dt>
                <dd className="mt-1 font-mono text-[11px] uppercase tracking-wider text-text-muted">{item.area}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </Section>
  );
}
