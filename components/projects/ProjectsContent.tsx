"use client";

import { useState } from "react";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import { FeaturedProduct } from "@/components/projects/FeaturedProduct";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectCarousel } from "@/components/projects/ProjectCarousel";
import { AnimatedH1 } from "@/components/ui/AnimatedH1";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import { PROJECTS } from "@/lib/projects/data";

const ALL = "__all__";

// Showcase de cases: destaque do produto próprio (ZLift), filtro por
// categoria (categorias reais de t.projects.items) e carrossel com o card
// detalhado de cada projeto (ProjectCard) — problema, solução, stack e links
// reais (Demo/GitHub só quando existem).
export function ProjectsContent() {
  const t = useTranslations();
  const p = t.projects;
  const [filter, setFilter] = useState(ALL);

  const categories = [...new Set(p.items.map((item) => item.category))];

  const items = PROJECTS.map((project, index) => ({ project, copy: p.items[index] }))
    .filter(({ copy }) => filter === ALL || copy.category === filter)
    .map(({ project, copy }) => ({
      key: project.title,
      title: project.title,
      content: <ProjectCard project={project} copy={copy} variant="detailed" />,
    }));

  return (
    <>
      {/* Hero */}
      <Section variant="hero">
        <Container>
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              {p.badge}
            </p>
            <AnimatedH1 className="mt-5 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-5xl" text={t.home.cases.title} />
            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">{p.description}</p>
          </div>
        </Container>
      </Section>

      {/* Produto em destaque */}
      <Section>
        <Container>
          <FeaturedProduct
            actions={
              <WhatsAppCta
                label={t.home.cases.similar}
                ariaLabel={`${t.home.cases.similar} ${t.cta.whatsappHint}`}
                size="sm"
              />
            }
          />
        </Container>
      </Section>

      {/* Todos os cases: filtro + carrossel */}
      <Section id="cases">
        <Container>
          <SectionHeader eyebrow={t.home.cases.eyebrow} title={p.allTitle} />

          <div role="group" aria-label={p.filterLabel} className="mb-8 flex flex-wrap gap-2">
            {[ALL, ...categories].map((category) => {
              const isActive = filter === category;

              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setFilter(category)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    isActive
                      ? "border-border-accent bg-accent/10 text-text-primary"
                      : "border-border bg-surface text-text-secondary hover:border-border-strong hover:text-text-primary"
                  }`}
                >
                  {category === ALL ? p.filterAll : category}
                </button>
              );
            })}
          </div>

          <Reveal>
            {/* key: reinicia o carrossel (e o slide ativo) ao trocar o filtro. */}
            <ProjectCarousel key={filter} labels={p.carousel} items={items} />
          </Reveal>
        </Container>
      </Section>

      <FinalCtaSection />
    </>
  );
}
