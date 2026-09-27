"use client";

import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  ChartNoAxesColumn,
  EyeOff,
  FileSpreadsheet,
  Hand,
  Headset,
  Repeat,
  Shuffle,
  Unlink,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useTranslations } from "@/lib/i18n/LanguageContext";

// Mesma ordem de t.home.problems.items.
const ICONS: LucideIcon[] = [
  FileSpreadsheet, // planilhas espalhadas
  Hand, // processos manuais
  Shuffle, // informações descentralizadas
  Repeat, // tarefas repetitivas
  Unlink, // sistemas que não conversam
  EyeOff, // dificuldade para acompanhar
  ChartNoAxesColumn, // falta de indicadores
  Headset, // atendimento manual
];

// Leve desalinhamento dos sintomas (só lg+): a operação "espalhada".
const TILT = ["lg:-rotate-1", "lg:rotate-1", "lg:rotate-[0.5deg]", "lg:-rotate-[0.75deg]"];

// Problema → resposta: à esquerda os sintomas soltos (dashed, esmaecidos);
// à direita o mesmo trabalho centralizado em um sistema.
export function ProblemsSection() {
  const t = useTranslations();
  const p = t.home.problems;

  return (
    <Section id="problemas">
      <Container>
        <SectionHeader eyebrow={p.eyebrow} title={p.title} />

        <div className="grid items-center gap-6 lg:grid-cols-[1.25fr_auto_1fr] lg:gap-8">
          <Reveal>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-text-muted">
              {p.beforeLabel}
            </p>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {p.items.map((item, index) => {
                const Icon = ICONS[index];

                return (
                  <li
                    key={item}
                    className={`flex items-center gap-3 rounded-lg border border-dashed border-border-strong bg-surface/40 px-3.5 py-3 text-sm text-text-secondary ${TILT[index % TILT.length]}`}
                  >
                    <Icon size={16} strokeWidth={1.75} aria-hidden="true" className="shrink-0 text-text-muted" />
                    {item}
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <div className="flex justify-center text-text-muted" aria-hidden="true">
            <ArrowDown size={20} className="lg:hidden" />
            <ArrowRight size={20} className="hidden lg:block" />
          </div>

          <Reveal delay={0.15}>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-accent">
              {p.afterLabel}
            </p>
            <div className="rounded-2xl border border-border-accent bg-surface p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <Image
                  src="/brand/ztech-mark.png"
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-md"
                />
                <div className="flex-1 space-y-1.5" aria-hidden="true">
                  <span className="block h-1.5 w-2/3 rounded-full bg-text-muted/30" />
                  <span className="block h-1.5 w-1/3 rounded-full bg-surface-muted" />
                </div>
              </div>

              <blockquote className="mt-6 text-balance text-xl font-medium leading-snug tracking-tight text-text-primary sm:text-2xl">
                &ldquo;{p.quote}&rdquo;
              </blockquote>

              <Button href="/contact" className="mt-8">
                {p.cta}
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
