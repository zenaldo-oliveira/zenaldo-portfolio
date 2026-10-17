"use client";

import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import { ProjectMedia } from "@/components/projects/ProjectMedia";
import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/lib/i18n/types";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import type { Project } from "@/lib/projects/data";

type ProjectCopy = Dictionary["projects"]["items"][number];

type ProjectCardProps = {
  project: Project;
  copy: ProjectCopy;
  // compact: Home (vitrine com CTAs de negócio, sem GitHub).
  // detailed: /projects (problema, solução, stack e links reais).
  variant: "compact" | "detailed";
};

const TECH_LIMIT = { compact: 3, detailed: 4 } as const;

// Card de case usado nos carrosséis da Home e de /projects. A mídia
// (captura real ou painel de marca) vem de ProjectMedia; o corpo mantém a
// mesma estrutura nas duas variantes, com as ações sempre alinhadas na base.
export function ProjectCard({ project, copy, variant }: ProjectCardProps) {
  const t = useTranslations();
  const isDetailed = variant === "detailed";
  const technologies = project.technologies.slice(0, TECH_LIMIT[variant]);

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-surface transition-[border-color,box-shadow] duration-300 hover:border-border-strong hover:shadow-xl hover:shadow-black/10 ${
        project.featured ? "border-border-accent" : "border-border"
      }`}
    >
      <ProjectMedia project={project} category={copy.category} />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {isDetailed && (
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                project.featured ? "border-border-accent bg-accent/10 text-accent" : "border-border text-text-secondary"
              }`}
            >
              {copy.status}
            </span>
          )}
          <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted">{copy.category}</span>
        </div>

        <h3 className="mt-3 text-lg font-semibold tracking-tight text-text-primary">{project.title}</h3>

        {isDetailed ? (
          <dl className="mt-3 space-y-3 text-sm">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wider text-accent">{t.projects.problemLabel}</dt>
              <dd className="mt-1 line-clamp-2 leading-relaxed text-text-secondary">{copy.problem}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wider text-accent">{t.projects.solutionLabel}</dt>
              <dd className="mt-1 line-clamp-3 leading-relaxed text-text-secondary">{copy.solution}</dd>
            </div>
          </dl>
        ) : (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text-secondary">{copy.solution}</p>
        )}

        {technologies.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {technologies.map((tech) => (
              <li key={tech} className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-text-secondary">
                {tech}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-6">
          {isDetailed ? <DetailedActions project={project} /> : <CompactActions />}
        </div>
      </div>
    </article>
  );
}

function SimilarCta() {
  const t = useTranslations();
  const label = t.home.cases.similar;

  // Nome acessível começa pelo texto visível (WCAG 2.5.3).
  return (
    <WhatsAppCta
      label={label}
      ariaLabel={`${label} ${t.cta.whatsappHint}`}
      size="sm"
      showArrow={false}
      className="flex-1 whitespace-nowrap"
    />
  );
}

function CompactActions() {
  const t = useTranslations();

  return (
    <>
      <Button href="/projects" variant="secondary" size="sm" className="flex-1 whitespace-nowrap">
        {t.home.cases.explore}
      </Button>
      <SimilarCta />
    </>
  );
}

function DetailedActions({ project }: { project: Project }) {
  const t = useTranslations();

  if (!project.demo && !project.github) return <SimilarCta />;

  return (
    <>
      {project.demo && (
        <Button href={project.demo} external size="sm" className="flex-1 whitespace-nowrap">
          <ExternalLink size={14} aria-hidden="true" />
          {t.projects.demoLabel}
        </Button>
      )}
      {project.github && (
        <Button href={project.github} external variant="secondary" size="sm" className="flex-1 whitespace-nowrap">
          <FaGithub size={14} aria-hidden="true" />
          {t.projects.githubLabel}
        </Button>
      )}
    </>
  );
}
