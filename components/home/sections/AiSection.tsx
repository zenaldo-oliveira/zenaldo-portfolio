"use client";

import { ArrowDown, Brain, MessageSquare, Send, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { useTranslations } from "@/lib/i18n/LanguageContext";

// IA e automação: texto/usos reais + um fluxo visual (entrada → IA → ação) e
// o case real que comprova a capacidade (Dieta IA, com Gemini AI).
export function AiSection() {
  const t = useTranslations();
  const ai = t.home.ai;

  const flow: { label: string; Icon: LucideIcon; isCore?: boolean }[] = [
    { label: ai.flow.input, Icon: MessageSquare },
    { label: ai.flow.ai, Icon: Brain, isCore: true },
    { label: ai.flow.action, Icon: Send },
  ];

  return (
    <Section id="ia" variant="compact">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">{ai.eyebrow}</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
            {ai.title}
          </h2>
          <p className="mt-4 text-pretty text-base leading-relaxed text-text-secondary">{ai.description}</p>

          <ul className="mt-6 flex flex-wrap gap-2">
            {ai.useCases.map((useCase) => (
              <li key={useCase} className="rounded-full border border-border bg-surface px-3 py-1 text-sm text-text-secondary">
                {useCase}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
            <Sparkles size={16} strokeWidth={1.75} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
            <p className="text-sm text-text-secondary">
              <span className="mr-2 font-mono text-[11px] uppercase tracking-wider text-text-muted">{ai.proofLabel}</span>
              {ai.proofText}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <ol className="mx-auto flex max-w-sm flex-col items-stretch rounded-2xl border border-border bg-surface/70 p-6 sm:p-8">
            {flow.map(({ label, Icon, isCore }, index) => (
              <li key={label} className="flex flex-col items-center">
                <div
                  className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 ${
                    isCore ? "border-border-accent bg-accent/10" : "border-border bg-background/60"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      isCore ? "bg-accent/15 text-accent" : "bg-surface-muted text-text-secondary"
                    }`}
                  >
                    <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium text-text-primary">{label}</span>
                </div>
                {index < flow.length - 1 && (
                  <ArrowDown size={16} aria-hidden="true" className="my-2 text-text-muted" />
                )}
              </li>
            ))}
          </ol>
        </Reveal>
      </Container>
    </Section>
  );
}
