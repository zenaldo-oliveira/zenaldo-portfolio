"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useTranslations } from "@/lib/i18n/LanguageContext";

const EASE = [0.16, 1, 0.3, 1] as const;

// Dispara assim que o bloco entra na tela (sem margem negativa).
const VIEWPORT = { once: true, amount: "some" } as const;

type ProcessSectionProps = {
  // Etapas próprias (ex.: as 4 da Home); padrão = as 7 de /how-it-works.
  steps?: readonly { title: string; description: string }[];
  eyebrow?: string;
  title?: string;
};

const COLUMNS: Record<number, string> = { 4: "xl:grid-cols-4", 7: "xl:grid-cols-7" };

// Timeline das etapas (padrão: t.commercial.howItWorks — mesma fonte da
// página /how-it-works). Horizontal em telas largas (linha que se preenche
// uma vez ao entrar na tela), vertical abaixo disso. As etapas entram só
// por deslocamento (nunca ocultas). Com movimento reduzido ou na impressão,
// o CSS anula o deslocamento e a escala dos elementos com data-reveal.
export function ProcessSection({ steps: customSteps, eyebrow, title }: ProcessSectionProps = {}) {
  const t = useTranslations();
  const w = t.home.howWeWork;
  const steps = customSteps ?? t.commercial.howItWorks.steps;

  return (
    <Section id="processo">
      <Container>
        <SectionHeader eyebrow={eyebrow ?? w.eyebrow} title={title ?? w.title} />

        <div className="relative">
          {/* Trilho + preenchimento (desktop) */}
          <div className="absolute left-0 right-0 top-5 hidden h-px bg-border xl:block" aria-hidden="true">
            <motion.div
              data-reveal=""
              className="h-px origin-left bg-accent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={VIEWPORT}
              transition={{ duration: 1.2, ease: EASE }}
            />
          </div>

          {/* Trilho vertical (até xl) */}
          <div className="absolute bottom-5 left-5 top-5 w-px bg-border xl:hidden" aria-hidden="true" />

          <ol className={`relative grid gap-8 xl:gap-5 ${COLUMNS[steps.length] ?? "xl:grid-cols-4"}`}>
            {steps.map((step, index) => (
              <motion.li
                key={step.title}
                data-reveal=""
                initial={{ y: 12 }}
                whileInView={{ y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.5, ease: EASE, delay: 0.15 + index * 0.12 }}
                className="flex gap-5 xl:flex-col xl:gap-5"
              >
                <span aria-hidden="true" className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-accent bg-background font-mono text-xs text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-text-primary">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{step.description}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <div className="mt-10">
          <Button href="/how-it-works" variant="link">
            {t.commercial.ctas.howItWorks}
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
        </div>
      </Container>
    </Section>
  );
}
