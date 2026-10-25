"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Globe, Sparkles, UserRound } from "lucide-react";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import { Container } from "@/components/ui/Container";
import { RevealItem, RevealStagger } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { StarBorder } from "@/components/ui/StarBorder";
import { useTranslations } from "@/lib/i18n/LanguageContext";

// Fechamento com dois caminhos: criar um projeto (configurador, StarBorder)
// ou pedir a análise de um site existente — pelo WhatsApp, com mensagem
// própria e aviso de que a análise é feita pela equipe (sem diagnóstico
// automático). Ao abrir o WhatsApp, a página confirma o que aconteceu.
export function PathsSection() {
  const t = useTranslations();
  const p = t.commercial.home.paths;
  const [hasOpenedWhatsApp, setHasOpenedWhatsApp] = useState(false);

  return (
    <Section id="contato" variant="spacious">
      <Container>
        <SectionHeader eyebrow={p.eyebrow} title={p.title} />

        <RevealStagger className="grid gap-4 md:grid-cols-2">
          <RevealItem className="relative flex flex-col overflow-hidden rounded-3xl border border-border-accent bg-surface p-7 sm:p-10">
            {/* Brilho único e discreto no caminho principal. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(60%_100%_at_30%_0%,var(--bg-glow),transparent)]"
            />
            <span className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-border-accent bg-accent/10 text-accent">
              <Sparkles size={20} aria-hidden="true" />
            </span>
            <h3 className="relative mt-6 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">{p.create.title}</h3>
            <p className="relative mt-3 max-w-md text-pretty leading-relaxed text-text-secondary">{p.create.description}</p>
            <div className="relative mt-auto pt-8">
              <StarBorder href="/build">
                {p.create.cta}
                <ArrowRight size={16} aria-hidden="true" />
              </StarBorder>
            </div>
          </RevealItem>

          <RevealItem className="flex flex-col rounded-3xl border border-border bg-surface/70 p-7 sm:p-10">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border-strong bg-surface-strong text-text-primary">
              <Globe size={20} aria-hidden="true" />
            </span>
            <h3 className="mt-6 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">{p.existing.title}</h3>
            <p className="mt-3 max-w-md text-pretty leading-relaxed text-text-secondary">{p.existing.description}</p>
            <p className="mt-4 flex max-w-md gap-2 text-sm leading-relaxed text-text-muted">
              <UserRound size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
              {p.existing.note}
            </p>
            <div className="mt-auto pt-8">
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                <WhatsAppCta
                  label={p.existing.cta}
                  message={p.existing.message}
                  ariaLabel={`${p.existing.cta} ${t.cta.whatsappHint}`}
                  variant="secondary"
                  className="active:scale-[0.98] motion-reduce:active:scale-100"
                  onClick={() => setHasOpenedWhatsApp(true)}
                />
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {p.formLink}
                </Link>
              </div>
              {/* Feedback da ação: anunciado e visível depois do clique. */}
              <p role="status" className="mt-4 min-h-5 text-sm text-text-secondary">
                {hasOpenedWhatsApp && (
                  <span className="inline-flex gap-2">
                    <CheckCircle2 size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
                    {p.existing.opened}
                  </span>
                )}
              </p>
            </div>
          </RevealItem>
        </RevealStagger>
      </Container>
    </Section>
  );
}
