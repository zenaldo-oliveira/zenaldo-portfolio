"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { useTranslations } from "@/lib/i18n/LanguageContext";

type FinalCtaSectionProps = {
  // Título/subtítulo próprios de outra página (ex.: /about); padrão = Home.
  title?: string;
  subtitle?: string;
};

// CTA final: WhatsApp direto (mensagem oficial em lib/contact/whatsapp) e,
// como alternativa, o formulário de /contact.
export function FinalCtaSection({ title, subtitle }: FinalCtaSectionProps) {
  const t = useTranslations();
  const cta = t.home.finalCta;

  return (
    // pt menor: a seção anterior já termina com espaçamento próprio.
    <Section id="contato" className="pt-4 lg:pt-8">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border-strong bg-surface px-6 py-14 text-center sm:px-12 sm:py-20">
            {/* Brilho único e discreto no topo do painel. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[radial-gradient(60%_100%_at_50%_0%,var(--bg-glow),transparent)]"
            />

            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-balance text-3xl font-semibold tracking-tight text-text-primary md:text-5xl">
                {title ?? cta.title}
              </h2>
              <p className="mt-3 text-balance text-xl font-medium tracking-tight text-accent md:text-2xl">
                {subtitle ?? cta.subtitle}
              </p>
              <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-text-secondary">
                {cta.description}
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <WhatsAppCta label={cta.cta} ariaLabel={t.cta.whatsappAriaLabel} />
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {cta.secondary}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
