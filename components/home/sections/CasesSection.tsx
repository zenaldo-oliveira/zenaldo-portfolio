"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectCarousel } from "@/components/projects/ProjectCarousel";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import { PROJECTS } from "@/lib/projects/data";

// Cases reais em carrossel (mesmo componente de /projects). Cada slide é o
// ProjectCard compacto: mídia real, categoria, nome, solução, tecnologias e
// CTAs de negócio ("Explorar" / "Quero algo parecido") — sem links de
// GitHub aqui; eles continuam na página de cases.
export function CasesSection() {
  const t = useTranslations();
  const c = t.home.cases;

  const items = PROJECTS.map((project, index) => ({
    key: project.title,
    title: project.title,
    content: <ProjectCard project={project} copy={t.projects.items[index]} variant="compact" />,
  }));

  return (
    <Section id="cases">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader eyebrow={c.eyebrow} title={c.title} description={c.description} className="mb-0" />
          <Link
            href="/projects"
            className="inline-flex shrink-0 items-center gap-2 rounded-md text-sm font-medium text-accent transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {c.viewAll}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <Reveal className="mt-10">
          <ProjectCarousel labels={t.projects.carousel} items={items} />
        </Reveal>
      </Container>
    </Section>
  );
}
