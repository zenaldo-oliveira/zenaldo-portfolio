"use client";

import Image from "next/image";
import { useState } from "react";
import { ExternalLink, FolderKanban, Globe } from "lucide-react";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import { FinalCtaSection } from "@/components/home/sections/FinalCtaSection";
import { FeaturedProduct } from "@/components/projects/FeaturedProduct";
import { ProjectCarousel } from "@/components/projects/ProjectCarousel";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import { PROJECTS } from "@/lib/projects/data";

const ALL = "__all__";

// Showcase de cases: destaque do produto próprio (ZLift), filtro por
// categoria (categorias reais de t.projects.items) e carrossel com o card
// completo de cada projeto — problema, solução, stack e links reais
// (Demo/GitHub só quando existem). Mesmos dados e URLs de antes.
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
      content: (
        <article
          className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-surface transition-colors duration-200 hover:border-border-strong ${
            project.featured ? "border-border-accent" : "border-border"
          }`}
        >
          {/* Prévia visual — screenshot real quando existir (project.image);
              até lá, um painel neutro que não finge ser captura de tela. */}
          <div className="relative aspect-video w-full overflow-hidden border-b border-border bg-surface-strong">
            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(min-width: 1280px) 420px, (min-width: 640px) 60vw, 88vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                <FolderKanban size={28} strokeWidth={1.5} aria-hidden="true" className="text-text-muted transition-colors duration-200 group-hover:text-accent" />
                <span className="font-mono text-xs text-text-muted">{project.title}</span>
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`w-fit rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                  project.featured ? "border-border-accent bg-accent/10 text-accent" : "border-border text-text-secondary"
                }`}
              >
                {copy.status}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted">{copy.category}</span>
            </div>

            <h3 className="mt-3 text-lg font-semibold tracking-tight text-text-primary">{project.title}</h3>

            <div className="mt-3 space-y-2.5 text-sm">
              <div>
                <span className="block font-mono text-[11px] uppercase tracking-wider text-accent">{p.problemLabel}</span>
                <p className="mt-1 line-clamp-2 text-text-secondary">{copy.problem}</p>
              </div>
              <div>
                <span className="block font-mono text-[11px] uppercase tracking-wider text-accent">{p.solutionLabel}</span>
                <p className="mt-1 line-clamp-3 text-text-secondary">{copy.solution}</p>
              </div>
            </div>

            {project.technologies.length > 0 && (
              <p className="mt-4 font-mono text-[11px] text-text-muted">{project.technologies.slice(0, 4).join(" · ")}</p>
            )}

            <div className="mt-auto flex gap-2 pt-5">
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-cta px-3 text-xs font-medium text-white transition-colors hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <ExternalLink size={14} aria-hidden="true" />
                  {p.demoLabel}
                </a>
              )}
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-medium text-text-primary transition-colors hover:border-border-strong hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Globe size={14} aria-hidden="true" />
                  {p.githubLabel}
                </a>
              )}
              {!project.demo && !project.github && (
                <WhatsAppCta label={t.home.cases.similar} ariaLabel={t.cta.whatsappAriaLabel} size="sm" showArrow={false} className="flex-1" />
              )}
            </div>
          </div>
        </article>
      ),
    }));

  return (
    <>
      {/* Hero */}
      <section className="px-4 pb-6 pt-12 sm:px-6 lg:pt-20">
        <Container>
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              {p.badge}
            </p>
            <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-5xl">
              {t.home.cases.title}
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">{p.description}</p>
          </div>
        </Container>
      </section>

      {/* Produto em destaque */}
      <section className="px-4 py-10 sm:px-6">
        <Container>
          <FeaturedProduct
            actions={<WhatsAppCta label={t.home.cases.similar} ariaLabel={t.cta.whatsappAriaLabel} size="sm" />}
          />
        </Container>
      </section>

      {/* Todos os cases: filtro + carrossel */}
      <Section id="cases" className="pt-10 lg:pt-14">
        <Container>
          <SectionHeader eyebrow={t.home.cases.eyebrow} title={p.allTitle} className="mb-8" />

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
