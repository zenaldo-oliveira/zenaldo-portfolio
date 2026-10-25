"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useTranslations } from "@/lib/i18n/LanguageContext";

// Dúvidas comerciais (implantação, mensalidade, domínio, hospedagem,
// alterações, IA, custos externos). <details> nativo: acessível por teclado e
// funciona sem JavaScript. Respostas não criam prazos, fidelidade ou
// garantias — o que depende da proposta diz isso.
type FaqSectionProps = {
  // Quantidade de perguntas exibidas (a Home mostra as primeiras) — com
  // limite, aparece o link para todas em /how-it-works#duvidas.
  limit?: number;
};

export function FaqSection({ limit }: FaqSectionProps = {}) {
  const t = useTranslations();
  const faq = t.commercial.faq;
  const items = limit ? faq.items.slice(0, limit) : faq.items;

  return (
    <Section id="duvidas">
      <Container size="lg">
        <SectionHeader eyebrow={faq.eyebrow} title={faq.title} />
        <div className="divide-y divide-border rounded-2xl border border-border bg-surface/70">
          {items.map((item) => (
            <details key={item.question} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-text-primary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:text-base [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className="shrink-0 text-text-muted transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
                />
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-text-secondary">{item.answer}</p>
            </details>
          ))}
        </div>
        {limit !== undefined && limit < faq.items.length && (
          <div className="mt-6">
            <Button href="/how-it-works#duvidas" variant="link">
              {t.commercial.home.faqAll}
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </div>
        )}
      </Container>
    </Section>
  );
}
