"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { FeaturedProduct } from "@/components/projects/FeaturedProduct";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import { PROJECTS } from "@/lib/projects/data";

const ZLIFT_INDEX = 0; // posição do ZLift em PROJECTS / t.projects.items

// Prova visual no /about: o ZLift em destaque (screenshot real quando existir
// em PROJECTS[0].image; até lá, o mockup conceitual) e os demais projetos
// reais em lista compacta. Textos vêm de t.projects.items — nada inventado.
export function AboutProof() {
  const t = useTranslations();
  const p = t.about.proof;

  const others = PROJECTS.map((project, index) => ({ project, copy: t.projects.items[index] })).filter(
    (_, index) => index !== ZLIFT_INDEX,
  );

  return (
    <Section id="construimos">
      <Container>
        <SectionHeader eyebrow={p.eyebrow} title={p.title} description={t.home.cases.description} />

        {/* Destaque: ZLift Manager */}
        <FeaturedProduct />

        {/* Demais projetos reais */}
        <Reveal delay={0.1} className="mt-12">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-text-muted">{p.othersLabel}</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {others.map(({ project, copy }) => (
              <li key={project.title}>
                <Link
                  href="/projects"
                  className="group flex h-full flex-col rounded-xl border border-border bg-surface p-5 transition-colors duration-200 hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[11px] uppercase tracking-wider text-text-muted">{copy.category}</p>
                      <h3 className="mt-1.5 text-base font-semibold tracking-tight text-text-primary">{project.title}</h3>
                    </div>
                    <ArrowUpRight
                      size={16}
                      aria-hidden="true"
                      className="shrink-0 text-text-muted transition-colors group-hover:text-accent"
                    />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-secondary">{copy.solution}</p>
                  {project.technologies.length > 0 && (
                    <p className="mt-auto pt-4 font-mono text-[11px] text-text-muted">
                      {project.technologies.slice(0, 3).join(" · ")}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <Button href="/projects" variant="secondary" className="mt-8">
          {p.cta}
          <ArrowRight size={16} aria-hidden="true" />
        </Button>
      </Container>
    </Section>
  );
}
