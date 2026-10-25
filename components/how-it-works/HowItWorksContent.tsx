"use client";

import { FaqSection } from "@/components/sections/FaqSection";
import { ContractingSection } from "@/components/how-it-works/ContractingSection";
import { AnimatedH1 } from "@/components/ui/AnimatedH1";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "@/lib/i18n/LanguageContext";

// /how-it-works: as 7 etapas, com o que a ZTech faz e o que o cliente faz em
// cada uma; depois, implantação e mensalidade e as dúvidas frequentes.
export function HowItWorksContent() {
  const t = useTranslations();
  const c = t.commercial;
  const h = c.howItWorks;

  return (
    <>
      <Section variant="hero">
        <Container size="lg">
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              {h.eyebrow}
            </p>
            <AnimatedH1 className="mt-5 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-5xl" text={h.title} />
            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">{h.description}</p>
          </div>
        </Container>
      </Section>

      <Section>
        <Container size="lg">
          <Reveal>
            <ol className="relative space-y-4">
              {h.steps.map((step, index) => (
                <li
                  key={step.title}
                  className="grid gap-4 rounded-2xl border border-border bg-surface/70 p-5 sm:grid-cols-[auto_1fr_1fr] sm:items-start sm:gap-6 sm:p-6"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border-accent bg-background font-mono text-xs text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold tracking-tight text-text-primary">{step.title}</h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{step.description}</p>
                  </div>
                  <div className="rounded-xl border border-border bg-background/40 p-3.5">
                    <p className="font-mono text-[11px] uppercase tracking-wider text-text-muted">{h.clientLabel}</p>
                    <p className="mt-1 text-sm leading-relaxed text-text-primary">{step.client}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </Container>
      </Section>

      <ContractingSection />

      <FaqSection />

      <Section variant="spacious">
        <Container size="lg">
          <div className="flex flex-col items-start gap-5 rounded-2xl border border-border-strong bg-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <p className="text-xl font-semibold tracking-tight text-text-primary">{h.ctaTitle}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/build">{c.ctas.buildProject}</Button>
              <Button href="/plans" variant="secondary">
                {c.ctas.viewPlans}
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
