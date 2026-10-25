"use client";

import { Brain, Database, MonitorSmartphone, Server, Smartphone, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import type { Dictionary } from "@/lib/i18n/types";
import { PROJECTS } from "@/lib/projects/data";

type AreaKey = keyof Dictionary["about"]["tech"]["groups"];

// Capacidade técnica real (antiga página /skills, sem as ferramentas de
// trabalho): tecnologias por área e os projetos reais em que já foram usadas.
// Nomes de tecnologia não se traduzem. `applied` só cita projetos de
// lib/projects/data.ts — vazio quando não há case público.
const AREAS: { key: AreaKey; Icon: LucideIcon; items: string[]; applied: string[] }[] = [
  { key: "web", Icon: MonitorSmartphone, items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "HTML5", "CSS3"], applied: ["Pet Shop Premium", "Barber Shop Premium", "Text To Voice AI"] },
  { key: "mobile", Icon: Smartphone, items: ["React Native", "Expo", "React Query", "Zustand"], applied: ["Dieta IA", "EasyCar Mobile"] },
  { key: "backend", Icon: Server, items: ["Node.js", "Express", "Fastify", "REST API"], applied: ["Dieta IA", "EasyCar Mobile"] },
  { key: "data", Icon: Database, items: ["PostgreSQL", "MySQL", "Prisma ORM", "Supabase"], applied: [] },
  { key: "ai", Icon: Brain, items: ["OpenAI", "Gemini AI", "Agentes IA", "Chatbots", "Prompt Engineering", "Web Speech API"], applied: ["Dieta IA", "Text To Voice AI"] },
  { key: "automation", Icon: Workflow, items: ["WhatsApp Automation", "Integração APIs", "Automação de Vendas"], applied: [] },
];

const PROJECT_TITLES = new Set(PROJECTS.map((project) => project.title));

export function AboutTech() {
  const t = useTranslations();
  const tech = t.about.tech;

  return (
    <Section id="tecnologias">
      <Container>
        <SectionHeader eyebrow={tech.eyebrow} title={tech.title} description={tech.description} />

        <Reveal>
          <dl className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {AREAS.map(({ key, Icon, items, applied }) => {
              const projects = applied.filter((name) => PROJECT_TITLES.has(name));

              return (
                <div key={key} className="flex flex-col bg-surface p-5 sm:p-6">
                  <dt className="flex items-center gap-3 text-lg font-semibold tracking-tight text-text-primary">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-accent">
                      <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    {tech.groups[key]}
                  </dt>
                  <dd className="mt-3 font-mono text-sm leading-relaxed text-text-secondary">{items.join(" · ")}</dd>
                  {projects.length > 0 && (
                    <dd className="mt-4">
                      <p className="font-mono text-[11px] uppercase tracking-wider text-text-muted">{tech.appliedIn}</p>
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {projects.map((name) => (
                          <li key={name} className="rounded-md border border-border-accent bg-accent/10 px-2 py-0.5 text-xs text-text-primary">
                            {name}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  )}
                </div>
              );
            })}
          </dl>
        </Reveal>
      </Container>
    </Section>
  );
}
