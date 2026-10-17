"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpDown,
  Camera,
  ClipboardList,
  FileText,
  ListChecks,
  PenLine,
  Play,
  Signature,
  Users,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import { PROJECTS } from "@/lib/projects/data";

// Mesma ordem de t.home.product.flow — o fluxo real descrito no case do ZLift:
// clientes, elevadores, técnicos, ordens de serviço, execução, checklist,
// fotos, observações, assinatura e relatório.
const FLOW_ICONS: LucideIcon[] = [
  Users,
  ArrowUpDown,
  Wrench,
  ClipboardList,
  Play,
  ListChecks,
  Camera,
  PenLine,
  Signature,
  FileText,
];

const ZLIFT_INDEX = 0; // posição do ZLift em PROJECTS / t.projects.items

// Prova de capacidade: o ZLift Manager, produto próprio da ZTech. Texto real
// do case (t.projects.items) + fluxo operacional da plataforma. Sem números.
export function ProductSpotlightSection() {
  const t = useTranslations();
  const p = t.home.product;
  const zlift = t.projects.items[ZLIFT_INDEX];
  const prefersReducedMotion = useReducedMotion();

  return (
    <Section id="produto" variant="spacious">
      <Container>
        <div className="overflow-hidden rounded-3xl border border-border bg-surface/70">
          <div className="grid lg:grid-cols-[1fr_1.1fr]">
            {/* Texto */}
            <div className="border-b border-border p-6 sm:p-10 lg:border-b-0 lg:border-r">
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">{p.eyebrow}</p>
                <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
                  {p.title}
                </h2>

                <div className="mt-8 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border-accent bg-accent/10 text-accent">
                    <ArrowUpDown size={18} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-lg font-semibold tracking-tight text-text-primary">
                      {PROJECTS[ZLIFT_INDEX].title}
                    </p>
                    <p className="text-sm text-text-secondary">{p.tagline}</p>
                  </div>
                </div>

                <p className="mt-6 text-sm leading-relaxed text-text-secondary">{zlift.solution}</p>

                <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-text-muted">
                  {zlift.category}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button href="/projects" variant="secondary">
                    {p.ctaPrimary}
                    <ArrowRight size={16} aria-hidden="true" />
                  </Button>
                  <WhatsAppCta label={p.ctaSecondary} ariaLabel={t.cta.whatsappAriaLabel} showArrow={false} />
                </div>
              </Reveal>
            </div>

            {/* Fluxo operacional */}
            <div className="p-6 sm:p-10">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-text-muted">{p.flowLabel}</p>

              <ol className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-2">
                {p.flow.map((step, index) => {
                  const Icon = FLOW_ICONS[index];

                  return (
                    <motion.li
                      key={step}
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: index * 0.04 }}
                      className="flex items-center gap-2.5 rounded-lg border border-border bg-background/50 px-3 py-2.5"
                    >
                      <span className="font-mono text-[10px] text-text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <Icon size={14} strokeWidth={1.75} aria-hidden="true" className="shrink-0 text-accent" />
                      <span className="truncate text-sm text-text-primary">{step}</span>
                    </motion.li>
                  );
                })}
              </ol>

              <p className="mt-6 font-mono text-[11px] text-text-muted">{p.caption}</p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
