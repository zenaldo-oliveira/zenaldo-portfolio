"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ProjectBuilder } from "@/components/builder/ProjectBuilder";
import { AnimatedH1 } from "@/components/ui/AnimatedH1";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { useTranslations } from "@/lib/i18n/LanguageContext";

// Nova combinação de parâmetros (?service, ?package, ?segment...) = novo
// fluxo: a chave remonta o configurador com o estado inicial correto.
function KeyedProjectBuilder() {
  const searchParams = useSearchParams();
  return <ProjectBuilder key={searchParams.toString()} />;
}

// /build: título no HTML do servidor (SEO); o fluxo lê ?solution= da URL e,
// por isso, fica dentro de um Suspense (no HTML estático aparece o esqueleto).
export function BuildContent() {
  const t = useTranslations();
  const b = t.commercial.builder;

  return (
    <Section variant="hero">
      <Container size="lg">
        <div className="max-w-3xl">
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            {b.eyebrow}
          </p>
          <AnimatedH1 className="mt-5 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-5xl" text={b.title} />
          <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">{b.description}</p>
        </div>

        <div className="mt-10">
          <Suspense fallback={<div aria-hidden="true" className="h-[32rem] animate-pulse rounded-3xl border border-border bg-surface/70 motion-reduce:animate-none" />}>
            <KeyedProjectBuilder />
          </Suspense>
        </div>
      </Container>
    </Section>
  );
}
