"use client";

import type { ReactNode } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { OfferImage } from "@/components/commercial/OffersSection";
import { ProjectMedia } from "@/components/projects/ProjectMedia";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Tabs } from "@/components/ui/Tabs";
import { getServiceOffer } from "@/lib/catalog/data";
import type { ServiceOfferId } from "@/lib/catalog/data";
import { HOME_PREVIEWS } from "@/lib/catalog/home";
import type { HomePreviewDef } from "@/lib/catalog/home";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import { PROJECTS } from "@/lib/projects/data";

type PanelCopy = {
  label: string;
  title: string;
  description: string;
  similar: ServiceOfferId;
  // Só para páginas web publicadas (o app e o protótipo não têm página pública).
  liveUrl?: string;
};

// Painel de uma prévia: mídia à esquerda (hover eleva/amplia a imagem),
// identificação ("Projeto real" ou "Imagem ilustrativa · protótipo"),
// descrição e ações à direita.
function PreviewPanel({ media, copy }: { media: ReactNode; copy: PanelCopy }) {
  const p = useTranslations().commercial.home.previews;

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
      <div className="group overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-2xl shadow-black/20">{media}</div>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-accent">{copy.label}</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">{copy.title}</h3>
        <p className="mt-3 text-pretty leading-relaxed text-text-secondary">{copy.description}</p>
        <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Button href={`/build?service=${copy.similar}`} variant="secondary" className="active:scale-[0.98] motion-reduce:active:scale-100">
            {p.similar}
            <ArrowRight size={15} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </Button>
          {copy.liveUrl && (
            <Button href={copy.liveUrl} external variant="link" className="text-sm">
              {p.viewOnline}
              <ExternalLink size={14} aria-hidden="true" />
              <span className="sr-only">: {copy.title}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Prévias em abas: projetos com captura real e um protótipo de sistema,
// sempre identificados. Só o painel ativo é montado (as imagens das outras
// abas não carregam no celular); a troca de painel e o indicador vêm do Tabs.
export function PreviewsSection() {
  const t = useTranslations();
  const c = t.commercial;
  const p = c.home.previews;

  function panelFor(preview: HomePreviewDef): ReactNode {
    if (preview.kind === "prototype") {
      const offer = getServiceOffer(preview.offer);
      if (!offer) return null;
      return (
        <PreviewPanel
          media={<OfferImage offer={offer} alt={c.showcase.offers[offer.id].imageAlt} />}
          copy={{ label: p.prototypeLabel, title: p.prototypeTitle, description: p.prototypeDescription, similar: preview.similar }}
        />
      );
    }
    const index = PROJECTS.findIndex((project) => project.title === preview.project);
    const project = PROJECTS[index];
    const copy = t.projects.items[index];
    if (!project?.media || !copy) return null;
    return (
      <PreviewPanel
        media={<ProjectMedia project={project} category={copy.category} />}
        copy={{
          label: `${p.realProject} · ${copy.category}`,
          title: project.title,
          description: copy.solution,
          similar: preview.similar,
          liveUrl: project.media.kind === "screenshot" ? project.demo : undefined,
        }}
      />
    );
  }

  const items = HOME_PREVIEWS.flatMap((preview) => {
    const panel = panelFor(preview);
    return panel ? [{ id: preview.id, label: p.tabs[preview.id], panel }] : [];
  });

  return (
    <Section id="exemplos">
      <Container>
        <SectionHeader eyebrow={p.eyebrow} title={p.title} description={p.description} />
        <Reveal>
          {/* Celular: abas em grade de 2 colunas (a última ocupa a linha),
              todas visíveis sem rolar a lista. */}
          <Tabs
            label={p.tablistLabel}
            items={items}
            className="[&_[role=tablist]]:grid [&_[role=tablist]]:grid-cols-2 [&_[role=tab]:last-child]:col-span-2 sm:[&_[role=tablist]]:inline-flex"
          />
        </Reveal>
      </Container>
    </Section>
  );
}
