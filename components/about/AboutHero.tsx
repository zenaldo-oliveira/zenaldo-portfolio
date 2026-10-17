"use client";

import Image from "next/image";
import { Brain, Globe, Layers, Plug, Smartphone, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { useTranslations } from "@/lib/i18n/LanguageContext";

// Mesma ordem de t.home.capabilities.items (Sistemas Web, SaaS, Aplicativos,
// IA, Automação, Integrações) — reaproveitada aqui como resumo da empresa.
const ICONS: LucideIcon[] = [Globe, Layers, Smartphone, Brain, Workflow, Plug];

// Hero do /about: a empresa é a protagonista. Texto + painel com o slogan da
// marca e o que a ZTech desenvolve (conteúdo real, sem números).
export function AboutHero() {
  const t = useTranslations();
  const a = t.about;

  return (
    <Section id="sobre" variant="hero">
      <Container className="grid items-center gap-12 xl:grid-cols-[1.25fr_1fr] xl:gap-16">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            {a.eyebrow}
          </p>

          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-5xl xl:text-[3.1rem]">
            {a.title}
          </h1>

          <p className="mt-6 text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">
            {a.description}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <WhatsAppCta label={a.cta} ariaLabel={t.cta.whatsappAriaLabel} />
            <Button href="/projects" variant="secondary">
              {a.secondaryCta}
            </Button>
          </div>
        </div>

        <Reveal delay={0.1}>
          <div className="rounded-2xl border border-border bg-surface/70 p-6 sm:p-8">
            <div className="flex items-center gap-3 border-b border-border pb-5">
              <Image src="/brand/ztech-mark.png" alt="" width={36} height={36} className="h-9 w-9 rounded-md" />
              <div>
                <p className="text-sm font-semibold text-text-primary">ZTech Solutions</p>
                <p className="font-mono text-[11px] uppercase tracking-wider text-text-muted">{t.brand.tagline}</p>
              </div>
            </div>

            <p className="mt-5 font-mono text-xs uppercase tracking-[0.14em] text-text-muted">{a.capabilitiesTitle}</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3.5">
              {t.home.capabilities.items.map((item, index) => {
                const Icon = ICONS[index];

                return (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-text-primary">
                    <Icon size={16} strokeWidth={1.75} aria-hidden="true" className="shrink-0 text-accent" />
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
