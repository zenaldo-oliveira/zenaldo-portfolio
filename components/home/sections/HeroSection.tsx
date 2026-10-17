"use client";

import { motion } from "framer-motion";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import { ZLiftMockup } from "@/components/home/ZLiftMockup";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { useTranslations } from "@/lib/i18n/LanguageContext";

const EASE = [0.16, 1, 0.3, 1] as const;

// Só deslocamento, sem opacidade: o texto do Hero (candidato a LCP) fica
// visível já no HTML do servidor, antes da hidratação.
function fadeUp(delay: number) {
  return {
    initial: { y: 12 },
    animate: { y: 0 },
    transition: { duration: 0.7, ease: EASE, delay },
  };
}

// Hero: texto à esquerda (quem é a ZTech e o que constrói) e, à direita, a
// interface conceitual do ZLift Manager — produto próprio — como prova de que
// a empresa constrói software. Sem fundo próprio: o cenário é o
// PageBackground global. H1 estático (sem efeito de digitação).
export function HeroSection() {
  const t = useTranslations();
  const hero = t.home.hero;

  return (
    <Section id="inicio" variant="hero" className="overflow-x-clip">
      <Container className="grid items-center gap-16 xl:grid-cols-[1.05fr_1fr] xl:gap-12">
        <div className="max-w-xl">
          <motion.p
            {...fadeUp(0)}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-accent"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            {hero.eyebrow}
          </motion.p>

          <motion.h1
            {...fadeUp(0.05)}
            className="mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-text-primary sm:text-5xl lg:text-[2.9rem] xl:text-[3.25rem]"
          >
            {hero.title}
          </motion.h1>

          <motion.p
            {...fadeUp(0.12)}
            className="mt-6 text-pretty text-base leading-relaxed text-text-secondary sm:text-lg"
          >
            {hero.description}
          </motion.p>

          <motion.div {...fadeUp(0.2)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <WhatsAppCta label={hero.ctaPrimary} ariaLabel={t.cta.whatsappAriaLabel} />
            <Button href="#cases" variant="secondary">
              {hero.ctaSecondary}
            </Button>
          </motion.div>
        </div>

        <ZLiftMockup />
      </Container>
    </Section>
  );
}
