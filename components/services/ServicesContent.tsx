"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import { FinalCtaSection } from "@/components/home/sections/FinalCtaSection";
import {
  AppPreview,
  FlowPreview,
  IntegrationsPreview,
  SaasPreview,
  SystemPreview,
  WebPreview,
} from "@/components/home/SolutionVisuals";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { useTranslations } from "@/lib/i18n/LanguageContext";

type Solution = {
  id: string;
  title: string;
  description: string;
  visual: ReactNode;
  // Índices em t.home.problems.items — só problemas reais que a solução ataca.
  problems: number[];
  // Projetos reais que aplicam a solução (nomes próprios, não traduzidos).
  applications: string[];
  stack: string[];
};

// Catálogo comercial: cada solução com o que resolve, onde já foi aplicada
// e a stack. Campos sem informação real ficam de fora — nada é inventado.
export function ServicesContent() {
  const t = useTranslations();
  const s = t.services;
  const [enterprise, saas, ai, automation, web, integrations] = s.items;
  const apps = t.home.solutions.items[1]; // "Aplicativos" (mesmo texto da Home)

  const solutions: Solution[] = [
    { id: "sistemas", ...enterprise, visual: <SystemPreview />, problems: [0, 2, 5], applications: ["ZLift Manager"], stack: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"] },
    { id: "saas", ...saas, visual: <SaasPreview />, problems: [], applications: ["ZLift Manager"], stack: ["Next.js", "Node.js", "PostgreSQL", "Supabase"] },
    { id: "aplicativos", ...apps, visual: <AppPreview />, problems: [], applications: ["Dieta IA", "EasyCar Mobile"], stack: ["React Native", "Expo", "Fastify", "Node.js"] },
    { id: "ia", ...ai, visual: <FlowPreview highlight={1} />, problems: [7, 3], applications: ["Dieta IA", "Text To Voice AI"], stack: ["Gemini AI", "OpenAI", "Web Speech API"] },
    { id: "automacao", ...automation, visual: <FlowPreview highlight={2} />, problems: [1, 3], applications: [], stack: ["WhatsApp", "Node.js", "APIs"] },
    { id: "web", ...web, visual: <WebPreview />, problems: [], applications: ["Pet Shop Premium", "Barber Shop Premium"], stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
    { id: "integracoes", ...integrations, visual: <IntegrationsPreview />, problems: [4], applications: [], stack: ["APIs", "Node.js", "PostgreSQL", "Supabase"] },
  ];

  return (
    // services-page: ritmo próprio entre seções desta página (globals.css),
    // sem alterar os tokens globais nem as demais rotas.
    <div className="services-page">
      {/* Hero */}
      <Section variant="hero">
        <Container>
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              {s.eyebrow}
            </p>
            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-5xl">
              {s.title}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">{s.description}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <WhatsAppCta label={s.ctaPrimary} ariaLabel={t.cta.whatsappAriaLabel} />
              <Button href="/projects" variant="secondary">
                {s.ctaSecondary}
              </Button>
            </div>
          </div>

          {/* Índice das soluções */}
          <nav aria-label={s.indexLabel} className="mt-14 border-t border-border pt-6">
            <p className="font-mono text-[11px] uppercase tracking-wider text-text-muted">{s.indexLabel}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {solutions.map((solution, index) => (
                <li key={solution.id}>
                  <a
                    href={`#${solution.id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="font-mono text-[10px] text-text-muted">{String(index + 1).padStart(2, "0")}</span>
                    {solution.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </Section>

      {/* Catálogo */}
      <Section>
        <Container className="space-y-5 lg:space-y-8">
          {solutions.map((solution, index) => {
            const problems = solution.problems.map((i) => t.home.problems.items[i]);
            const isReversed = index % 2 === 1;

            return (
              <Reveal key={solution.id}>
                <article id={solution.id} className="grid overflow-hidden rounded-3xl border border-border bg-surface/70 lg:grid-cols-2">
                  <div className={`flex flex-col p-6 sm:p-8 ${isReversed ? "lg:order-last" : ""}`}>
                    <p className="font-mono text-xs text-text-muted">{String(index + 1).padStart(2, "0")}</p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">{solution.title}</h2>
                    <p className="mt-3 text-pretty text-base leading-relaxed text-text-secondary lg:mt-4">{solution.description}</p>

                    <dl className="mt-7 space-y-4 border-t border-border pt-6 text-sm lg:mt-10">
                      {problems.length > 0 && (
                        <div className="grid gap-1.5 sm:grid-cols-[8.5rem_1fr]">
                          <dt className="font-mono text-[11px] uppercase tracking-wider text-text-muted">{s.labels.problem}</dt>
                          <dd className="text-text-secondary">{problems.join(" · ")}</dd>
                        </div>
                      )}
                      {solution.applications.length > 0 && (
                        <div className="grid gap-1.5 sm:grid-cols-[8.5rem_1fr]">
                          <dt className="font-mono text-[11px] uppercase tracking-wider text-text-muted">{s.labels.application}</dt>
                          <dd className="flex flex-wrap gap-1.5">
                            {solution.applications.map((name) => (
                              <span key={name} className="rounded-md border border-border-accent bg-accent/10 px-2 py-0.5 text-xs text-text-primary">
                                {name}
                              </span>
                            ))}
                          </dd>
                        </div>
                      )}
                      <div className="grid gap-1.5 sm:grid-cols-[8.5rem_1fr]">
                        <dt className="font-mono text-[11px] uppercase tracking-wider text-text-muted">{s.labels.stack}</dt>
                        <dd className="font-mono text-xs text-text-secondary">{solution.stack.join(" · ")}</dd>
                      </div>
                    </dl>

                    {/* mt-auto: o CTA assenta na base do card quando a coluna visual é mais alta. */}
                    <div className="mt-auto pt-8">
                      <WhatsAppCta label={s.itemCta} ariaLabel={t.cta.whatsappAriaLabel} size="sm" />
                    </div>
                  </div>

                  <div
                    className={`flex items-center justify-center border-t border-border bg-background/40 p-8 sm:p-12 lg:border-t-0 ${
                      isReversed ? "lg:border-r" : "lg:border-l"
                    }`}
                  >
                    {/* zoom: amplia o preview (desenhado em escala de card) sem refazer o layout interno. */}
                    <div className="w-full max-w-md lg:[zoom:1.2]">{solution.visual}</div>
                  </div>
                </article>
              </Reveal>
            );
          })}

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-md pt-4 text-sm font-medium text-accent transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t.home.cases.viewAll}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </Container>
      </Section>

      <FinalCtaSection />
    </div>
  );
}
