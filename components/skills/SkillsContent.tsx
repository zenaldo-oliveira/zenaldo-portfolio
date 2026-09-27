"use client";

import { Brain, Database, MonitorSmartphone, Server, Smartphone, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FinalCtaSection } from "@/components/home/sections/FinalCtaSection";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { useTranslations } from "@/lib/i18n/LanguageContext";

type GroupKey = "web" | "mobile" | "backend" | "data" | "ai" | "automation";

// Tecnologias reais (as que esta página já listava + a stack dos projetos em
// lib/projects/data.ts), agrupadas por capacidade. `applied` = projetos reais
// que usam aquele grupo — vazio quando não há case público para citar.
const GROUPS: { key: GroupKey; Icon: LucideIcon; items: string[]; applied: string[] }[] = [
  { key: "web", Icon: MonitorSmartphone, items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "HTML5", "CSS3"], applied: ["Pet Shop Premium", "Barber Shop Premium", "Text To Voice AI"] },
  { key: "mobile", Icon: Smartphone, items: ["React Native", "Expo", "React Query", "Zustand"], applied: ["Dieta IA", "EasyCar Mobile"] },
  { key: "backend", Icon: Server, items: ["Node.js", "Express", "Fastify", "REST API"], applied: ["Dieta IA", "EasyCar Mobile"] },
  { key: "data", Icon: Database, items: ["PostgreSQL", "MySQL", "Prisma ORM", "Supabase"], applied: [] },
  { key: "ai", Icon: Brain, items: ["OpenAI", "Gemini AI", "Agentes IA", "Chatbots", "Prompt Engineering", "Web Speech API"], applied: ["Dieta IA", "Text To Voice AI"] },
  { key: "automation", Icon: Workflow, items: ["WhatsApp Automation", "Integração APIs", "Automação de Vendas"], applied: [] },
];

const TOOLS = ["Git", "GitHub", "Postman", "Figma", "VS Code", "ESLint"];

// Capacidades técnicas da ZTech: tecnologia como prova de capacidade de
// entrega (onde já foi aplicada), não como currículo.
export function SkillsContent() {
  const t = useTranslations();
  const s = t.skills;

  return (
    <>
      <section className="px-4 pb-6 pt-12 sm:px-6 lg:pt-20">
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
          </div>
        </Container>
      </section>

      <Section className="pt-10 lg:pt-14">
        <Container>
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-border bg-surface/70">
              {GROUPS.map(({ key, Icon, items, applied }) => (
                <div
                  key={key}
                  className="grid gap-4 border-b border-border p-6 last:border-b-0 sm:p-8 lg:grid-cols-[14rem_1fr_16rem] lg:items-center lg:gap-8"
                >
                  <h2 className="flex items-center gap-3 text-lg font-semibold tracking-tight text-text-primary">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-accent">
                      <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    {s.groups[key]}
                  </h2>

                  <p className="font-mono text-sm leading-relaxed text-text-secondary">{items.join(" · ")}</p>

                  {applied.length > 0 ? (
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-text-muted">{s.appliedIn}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {applied.map((name) => (
                          <span key={name} className="rounded-md border border-border-accent bg-accent/10 px-2 py-0.5 text-xs text-text-primary">
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <span className="hidden lg:block" aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>
          </Reveal>

          <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-secondary">
            <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted">{s.toolsTitle}</span>
            <span className="font-mono">{TOOLS.join(" · ")}</span>
          </p>
        </Container>
      </Section>

      <FinalCtaSection />
    </>
  );
}
