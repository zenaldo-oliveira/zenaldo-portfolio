"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useTranslations } from "@/lib/i18n/LanguageContext";

const EASE = [0.16, 1, 0.3, 1] as const;

// Timeline de 4 etapas. Horizontal no desktop (linha que se preenche uma vez
// ao entrar na tela), vertical no mobile. Sem movimento com reduced motion.
export function ProcessSection() {
  const t = useTranslations();
  const w = t.home.howWeWork;
  const prefersReducedMotion = useReducedMotion();

  return (
    <Section id="processo">
      <Container>
        <SectionHeader eyebrow={w.eyebrow} title={w.title} />

        <div className="relative">
          {/* Trilho + preenchimento (desktop) */}
          <div className="absolute left-0 right-0 top-5 hidden h-px bg-border lg:block" aria-hidden="true">
            <motion.div
              className="h-px origin-left bg-accent"
              initial={prefersReducedMotion ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 1.2, ease: EASE }}
            />
          </div>

          {/* Trilho vertical (mobile/tablet) */}
          <div className="absolute bottom-5 left-5 top-5 w-px bg-border lg:hidden" aria-hidden="true" />

          <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-8">
            {w.steps.map((step, index) => (
              <motion.li
                key={step.title}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.15 + index * 0.12 }}
                className="flex gap-5 lg:flex-col lg:gap-6"
              >
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-accent bg-background font-mono text-xs text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-text-primary">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{step.description}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
