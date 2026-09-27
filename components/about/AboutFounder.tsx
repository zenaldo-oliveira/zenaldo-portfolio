"use client";

import { ArrowUpRight } from "lucide-react";
import { AboutFormationCard } from "@/components/about/AboutFormationCard";
import { AboutProfilePhoto } from "@/components/about/AboutProfilePhoto";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import { SOCIAL_LINKS } from "@/lib/site";

const FOUNDER_NAME = "Zenaldo Oliveira";

// Quem está por trás da ZTech: o fundador como prova de quem constrói — texto
// curto e factual (vem do conteúdo existente), formação como detalhe
// secundário e o LinkedIn como referência profissional.
export function AboutFounder() {
  const t = useTranslations();
  const f = t.about.founder;

  return (
    <Section id="fundador">
      <Container className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <AboutProfilePhoto name={FOUNDER_NAME} role={f.role} />
        </Reveal>

        <Reveal delay={0.1}>
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">{f.eyebrow}</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">{f.title}</h2>

          <div className="mt-6 space-y-4 text-pretty text-base leading-relaxed text-text-secondary">
            {f.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-accent transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            LinkedIn
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>

          <div className="mt-8">
            <AboutFormationCard />
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
