"use client";

import { Brain, Database, MonitorSmartphone, Server, Smartphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import { TECH_GROUPS } from "@/lib/projects/data";

const ICONS: Record<(typeof TECH_GROUPS)[number]["key"], LucideIcon> = {
  web: MonitorSmartphone,
  mobile: Smartphone,
  backend: Server,
  data: Database,
  ai: Brain,
};

// Tecnologia como capacidade (não parede de logos): linhas por área, com as
// tecnologias reais usadas nos projetos e neste próprio site.
export function TechnologiesSection() {
  const t = useTranslations();
  const tech = t.home.technologies;

  return (
    <Section id="tecnologias">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <SectionHeader eyebrow={tech.eyebrow} title={tech.title} description={tech.description} className="mb-0" />

          <Reveal>
            <dl className="divide-y divide-border border-y border-border">
              {TECH_GROUPS.map((group) => {
                const Icon = ICONS[group.key];

                return (
                  <div key={group.key} className="grid gap-3 py-5 sm:grid-cols-[11rem_1fr] sm:items-center">
                    <dt className="flex items-center gap-2.5 text-sm font-medium text-text-primary">
                      <Icon size={16} strokeWidth={1.75} aria-hidden="true" className="text-accent" />
                      {tech.groups[group.key]}
                    </dt>
                    <dd className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span key={item} className="rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs text-text-secondary">
                          {item}
                        </span>
                      ))}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
