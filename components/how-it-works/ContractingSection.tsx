"use client";

import { ArrowRight, Repeat, Rocket } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal, RevealItem, RevealStagger } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { StarBorder } from "@/components/ui/StarBorder";
import { useTranslations } from "@/lib/i18n/LanguageContext";

// Implantação + mensalidade: o modelo de contratação, sem afirmar o que cada
// valor inclui (isso vem na proposta). highlightCta (Home): "Montar meu
// projeto" com StarBorder; os blocos entram em sequência ao rolar.
export function ContractingSection({ highlightCta = false }: { highlightCta?: boolean } = {}) {
  const t = useTranslations();
  const c = t.commercial;
  const k = c.home.contracting;

  const blocks = [
    { Icon: Rocket, label: c.setupLabel, text: k.setup },
    { Icon: Repeat, label: c.monthlyLabel, text: k.monthly },
  ];

  return (
    <Section id="contratacao">
      <Container>
        <SectionHeader eyebrow={k.eyebrow} title={k.title} />
        <RevealStagger className="grid gap-4 md:grid-cols-2">
          {blocks.map(({ Icon, label, text }) => (
            <RevealItem key={label} className="flex gap-4 rounded-2xl border border-border bg-surface p-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border-accent bg-accent/10 text-accent">
                <Icon size={18} aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-text-primary">{label}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary sm:text-base">{text}</p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
        <Reveal>
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-text-muted">{k.proposalLine}</p>
            <div className="flex flex-wrap gap-3">
              {highlightCta ? (
                <StarBorder href="/build">
                  {k.cta}
                  <ArrowRight size={15} aria-hidden="true" />
                </StarBorder>
              ) : (
                <Button href="/build" size="sm">
                  {k.cta}
                  <ArrowRight size={15} aria-hidden="true" />
                </Button>
              )}
              <Button href="/plans" variant="secondary" size={highlightCta ? "md" : "sm"}>
                {c.ctas.viewPlans}
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
