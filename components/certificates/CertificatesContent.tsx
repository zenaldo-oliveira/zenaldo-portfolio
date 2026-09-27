"use client";

import { BookOpen, CalendarClock, Check, GraduationCap } from "lucide-react";
import { FinalCtaSection } from "@/components/home/sections/FinalCtaSection";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { useTranslations } from "@/lib/i18n/LanguageContext";

// Anos — não traduzíveis (números universais), casados por índice com
// t.certificates.items. "-" = certificação ainda não obtida (prevista).
const YEARS = ["2025", "2026", "-", "-", "-", "-"];
const COMPLETED_INDEX = 0; // graduação concluída

// Formação e certificações do fundador, em tom institucional: linha do tempo
// da formação obtida/em andamento; estudos atuais e certificações previstas
// como informação secundária — nunca apresentadas como conquistas.
export function CertificatesContent() {
  const t = useTranslations();
  const c = t.certificates;

  const timeline = c.items.map((item, index) => ({ ...item, year: YEARS[index], index })).filter((item) => item.year !== "-");
  const planned = c.items.filter((_, index) => YEARS[index] === "-");

  return (
    <>
      <section className="px-4 pb-6 pt-12 sm:px-6 lg:pt-20">
        <Container>
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              {c.eyebrow}
            </p>
            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-5xl">
              {c.title}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">{c.description}</p>
          </div>
        </Container>
      </section>

      <Section className="pt-10 lg:pt-14">
        <Container className="grid items-start gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* Formação obtida / em andamento */}
          <Reveal>
            <div className="rounded-3xl border border-border bg-surface/70 p-6 sm:p-10">
              <h2 className="flex items-center gap-3 text-lg font-semibold tracking-tight text-text-primary">
                <GraduationCap size={18} strokeWidth={1.75} aria-hidden="true" className="text-accent" />
                {c.formationTitle}
              </h2>

              <ol className="relative mt-8 space-y-8 border-l border-border pl-8">
                {timeline.map((item) => {
                  const isDone = item.index === COMPLETED_INDEX;

                  return (
                    <li key={item.title} className="relative">
                      <span
                        className={`absolute left-[-2.6rem] top-0.5 flex h-5 w-5 items-center justify-center rounded-full border ${
                          isDone ? "border-accent bg-accent text-white" : "border-border-accent bg-background text-accent"
                        }`}
                        aria-hidden="true"
                      >
                        {isDone ? <Check size={11} strokeWidth={3} /> : <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                      </span>
                      <p className="font-mono text-xs text-text-muted">{item.year}</p>
                      <h3 className="mt-1 text-lg font-semibold tracking-tight text-text-primary">{item.title}</h3>
                      <p className="mt-1 text-sm text-text-secondary">
                        {item.institution} · <span className={isDone ? "text-text-primary" : "text-accent"}>{item.status}</span>
                      </p>
                    </li>
                  );
                })}
              </ol>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="space-y-6">
            {/* Estudos em andamento */}
            <div className="rounded-3xl border border-border bg-surface/70 p-6 sm:p-8">
              <h2 className="flex items-center gap-3 text-base font-semibold tracking-tight text-text-primary">
                <BookOpen size={16} strokeWidth={1.75} aria-hidden="true" className="text-accent" />
                {c.studyingTitle}
              </h2>
              <p className="mt-4 font-mono text-sm leading-relaxed text-text-secondary">{c.studyingItems.join(" · ")}</p>
            </div>

            {/* Certificações previstas (ainda não obtidas) */}
            <div className="rounded-3xl border border-dashed border-border-strong p-6 sm:p-8">
              <h2 className="flex items-center gap-3 text-base font-semibold tracking-tight text-text-primary">
                <CalendarClock size={16} strokeWidth={1.75} aria-hidden="true" className="text-text-muted" />
                {c.plannedTitle}
              </h2>
              <ul className="mt-4 space-y-2">
                {planned.map((item) => (
                  <li key={item.title} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-text-secondary">{item.title}</span>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted">{item.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </Section>

      <FinalCtaSection />
    </>
  );
}
