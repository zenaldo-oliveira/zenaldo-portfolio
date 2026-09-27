"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { AppPreview, FlowPreview, SaasPreview, SystemPreview } from "@/components/home/SolutionVisuals";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useTranslations } from "@/lib/i18n/LanguageContext";

// Preview de cada bloco, na ordem de t.home.solutions.items: Sistemas
// personalizados, Aplicativos (Dieta IA), SaaS (ZLift Manager), IA e automação.
const VISUALS: ReactNode[] = [
  <SystemPreview key="system" />,
  <AppPreview key="app" />,
  <SaasPreview key="saas" />,
  <FlowPreview key="flow" highlight={1} />,
];

// Casos reais de cada tipo de solução (nomes próprios, não traduzidos).
const EXAMPLES: string[][] = [[], ["Dieta IA", "EasyCar Mobile"], ["ZLift Manager"], ["Dieta IA"]];

// Bento assimétrico: Sistemas (largo) + Aplicativos (alto) na primeira linha,
// SaaS e IA na segunda.
const LAYOUT = [
  "lg:col-span-4",
  "lg:col-span-2 lg:row-span-2",
  "lg:col-span-2",
  "lg:col-span-2",
];

type SolutionsSectionProps = {
  // Rótulo acima do título — /about usa "O que fazemos"; padrão = Home.
  eyebrow?: string;
};

export function SolutionsSection({ eyebrow }: SolutionsSectionProps) {
  const t = useTranslations();
  const s = t.home.solutions;

  return (
    <Section id="solucoes">
      <Container>
        <SectionHeader eyebrow={eyebrow ?? s.eyebrow} title={s.title} description={s.description} />

        <div className="grid gap-4 lg:grid-cols-6">
          {s.items.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06} className={LAYOUT[index]}>
              <article className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-6 transition-colors duration-200 hover:border-border-strong">
                <div className={index === 1 ? "order-last mt-8 lg:mt-auto lg:pt-8" : "mb-6"}>{VISUALS[index]}</div>

                <h3 className="text-lg font-semibold tracking-tight text-text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.description}</p>

                {EXAMPLES[index].length > 0 && (
                  <p className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono uppercase tracking-wider text-text-muted">{s.examplesLabel}</span>
                    {EXAMPLES[index].map((name) => (
                      <span key={name} className="rounded-md border border-border px-2 py-0.5 text-text-secondary">
                        {name}
                      </span>
                    ))}
                  </p>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        <Link
          href="/services"
          className="mt-8 inline-flex items-center gap-2 rounded-md text-sm font-medium text-accent transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {s.viewAll}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </Container>
    </Section>
  );
}
