"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FolderKanban } from "lucide-react";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import { ProjectCarousel } from "@/components/projects/ProjectCarousel";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import { PROJECTS } from "@/lib/projects/data";

// Cases reais em carrossel (mesmo componente de /projects). Cada slide é
// apresentado como produto: visual, categoria, nome, solução, tecnologias e
// CTAs de negócio ("Explorar" / "Quero algo parecido") — sem links de
// GitHub aqui; eles continuam na página de cases.
export function CasesSection() {
  const t = useTranslations();
  const c = t.home.cases;

  const items = PROJECTS.map((project, index) => {
    const copy = t.projects.items[index];

    return {
      key: project.title,
      title: project.title,
      content: (
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-200 hover:border-border-strong">
          <div className="relative aspect-16/10 overflow-hidden border-b border-border bg-surface-strong">
            {project.image ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(min-width: 1280px) 420px, (min-width: 640px) 60vw, 88vw"
                className="object-cover"
              />
            ) : (
              // Sem screenshot real ainda: painel neutro com o nome do
              // produto — nunca uma captura de tela inventada.
              <div className="flex h-full flex-col items-center justify-center gap-3">
                <FolderKanban size={28} strokeWidth={1.5} aria-hidden="true" className="text-text-muted" />
                <span className="font-mono text-xs text-text-muted">{project.title}</span>
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-text-muted">{copy.category}</p>
            <h3 className="mt-2 text-lg font-semibold tracking-tight text-text-primary">{project.title}</h3>
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text-secondary">{copy.solution}</p>

            {project.technologies.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.technologies.slice(0, 3).map((tech) => (
                  <span key={tech} className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-text-secondary">
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-auto flex flex-wrap gap-2 pt-5">
              <Button href="/projects" variant="secondary" size="sm">
                {c.explore}
              </Button>
              <WhatsAppCta label={c.similar} ariaLabel={t.cta.whatsappAriaLabel} size="sm" showArrow={false} />
            </div>
          </div>
        </article>
      ),
    };
  });

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
