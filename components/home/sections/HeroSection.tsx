"use client";

import { useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { HeroDemo } from "@/components/home/HeroDemo";
import { AnimatedH1 } from "@/components/ui/AnimatedH1";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { StarBorder } from "@/components/ui/StarBorder";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import { SpinningText } from "@/components/ui/spinning-text";

const EASE = [0.16, 1, 0.3, 1] as const;

// Entrada do Hero igual no servidor e no navegador (só deslocamento, sem
// opacidade). Com movimento reduzido, a MotionConfig global torna a
// transição instantânea e o CSS de [data-reveal] anula o deslocamento
// desde o HTML — sem depender da preferência na primeira renderização.
function fadeUp(delay: number) {
  return {
    "data-reveal": "",
    initial: { y: 12 },
    animate: { y: 0 },
    transition: { duration: 0.7, ease: EASE, delay },
  };
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// Preferência de movimento reduzido segura para hidratação: `false` no
// servidor e na hidratação (HTML idêntico); logo depois, a do sistema. O
// SpinningText usa motion/react, fora da MotionConfig do framer-motion.
function useHydratedReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, () => window.matchMedia(REDUCED_MOTION_QUERY).matches, () => false);
}

export function HeroSection() {
  const t = useTranslations();
  const hero = t.home.hero;
  const notes = t.commercial.home.heroNotes;
  const reduceMotion = useHydratedReducedMotion();

  return (
    <Section id="inicio" variant="hero" className="overflow-x-clip xl:pb-16">
      <Container className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-6 xl:gap-12">
        {/* Texto no topo da linha (não centrado contra a espiral, que é mais
            alta e define a altura da linha): começa a 20px do cabeçalho, só o
            espaço da seção (--space-hero-top). */}
        <div className="min-w-0 max-w-xl lg:self-start">
          <motion.p
            {...fadeUp(0)}
            className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-accent"
          >
            <span
              className="h-1.5 w-1.5 rounded-full bg-accent"
              aria-hidden="true"
            />
            {hero.eyebrow}
          </motion.p>

          {/* Círculo abaixo da descrição */}

          <AnimatedH1
            {...fadeUp(0.05)}
            text={hero.title}
            className="mt-5 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-5xl lg:text-[2.25rem] xl:text-[2.75rem]"
          />

          <motion.p
            {...fadeUp(0.12)}
            className="mt-6 max-w-lg text-pretty text-base leading-relaxed text-text-secondary sm:text-lg"
          >
            {hero.description}
          </motion.p>

          <motion.div
            {...fadeUp(0.2)}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <StarBorder href="/build">
              {hero.ctaPrimary}
              <ArrowRight
                size={16}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
              />
            </StarBorder>

            <Button href="/projects" variant="secondary">
              {hero.ctaSecondary}
            </Button>
          </motion.div>

          <div
            className="mt-6 grid h-36 w-36 place-items-center text-accent"
            aria-hidden="true"
          >
            {reduceMotion ? (
              <span className="text-center text-sm font-medium">
                Sites • Sistemas • Automações
              </span>
            ) : (
              <SpinningText className="text-sm font-medium">
                Sites • Sistemas • Automações •
              </SpinningText>
            )}
          </div>

          <motion.ul
            {...fadeUp(0.26)}
            className="mt-7 grid gap-3 border-t border-border pt-6"
          >
            {notes.map((note) => (
              <li
                key={note}
                className="flex items-start gap-2.5 text-sm leading-relaxed text-text-secondary"
              >
                <Check
                  size={16}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-accent"
                />
                <span>{note}</span>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Espiral na mesma posição de antes do ajuste do texto: com a seção
            em 20px, a coluna repõe a diferença — 40px do cabeçalho no xl e o
            antigo clamp(48px → 80px) no lg. Empilhada (< lg), segue o texto. */}
        <div className="min-w-0 lg:pt-[calc(clamp(3rem,2.257rem+3.048vw,5rem)-1.25rem)] xl:pt-5">
          <HeroDemo />
        </div>
      </Container>
    </Section>
  );
}
