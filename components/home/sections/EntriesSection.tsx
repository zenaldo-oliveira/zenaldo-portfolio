"use client";

import Link from "next/link";
import { ArrowRight, Check, Plus, Wrench } from "lucide-react";
import { OfferImage } from "@/components/commercial/OffersSection";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/Container";
import { RevealItem, RevealStagger } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { getServiceOffer } from "@/lib/catalog/data";
import { getEntryResources, HOME_ENTRIES, isEntryCustom } from "@/lib/catalog/home";
import type { HomeEntryDef } from "@/lib/catalog/home";
import { useTranslations } from "@/lib/i18n/LanguageContext";

// Recursos exibidos por cartão (os já entregues vêm primeiro).
const MAX_RESOURCES = 4;

function EntryCard({ entry }: { entry: HomeEntryDef }) {
  const t = useTranslations();
  const c = t.commercial;
  const e = c.home.entries;
  const copy = e.items[entry.id];
  const isCustom = isEntryCustom(entry);
  const image = getServiceOffer(entry.imageOffer);
  const resources = getEntryResources(entry).slice(0, MAX_RESOURCES);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-[translate,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-border-accent hover:shadow-xl hover:shadow-black/15 focus-within:border-border-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0">
      {image && <OfferImage offer={image} alt={copy.imageAlt} />}

      <div className="flex flex-1 flex-col p-6">
        <Badge variant={isCustom ? "outline" : "default"}>
          {isCustom && <Wrench size={11} aria-hidden="true" />}
          {c.availability[isCustom ? "custom" : "available"].label}
        </Badge>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-text-primary">{copy.name}</h3>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-text-secondary">{copy.benefit}</p>

        <p className="mt-5 font-mono text-[11px] uppercase tracking-wider text-text-muted">{e.resourcesLabel}</p>
        <ul className="mt-2.5 space-y-2">
          {resources.map((resource) => (
            <li key={resource.id} className="flex gap-2 text-sm leading-snug text-text-secondary">
              {resource.implemented ? (
                <Check size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
              ) : (
                <Plus size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-text-muted" />
              )}
              <span>
                {c.showcase.resources[resource.id]}
                {!resource.implemented && <span className="text-text-muted"> · {c.showcase.customLabel}</span>}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-6">
          <Link
            href={entry.href}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background/40 px-4 text-sm font-medium text-text-primary transition-[background-color,border-color,scale] duration-150 hover:border-border-accent hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] motion-reduce:active:scale-100"
          >
            {copy.cta}
            <ArrowRight size={15} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </Link>
        </div>
      </div>
    </article>
  );
}

// Três entradas comerciais (Landing pages, Sites empresariais, Sistemas web
// e automações). Cada cartão: imagem do catálogo (captura real, rotulada),
// selo de disponibilidade, benefício, recursos — os sob medida marcados — e
// o CTA específico para o configurador. Entram em sequência ao rolar.
export function EntriesSection() {
  const e = useTranslations().commercial.home.entries;

  return (
    <Section id="entradas">
      <Container>
        <SectionHeader eyebrow={e.eyebrow} title={e.title} description={e.description} />
        <RevealStagger as="ul" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {HOME_ENTRIES.map((entry) => (
            <RevealItem as="li" key={entry.id} className="md:last:col-span-2 lg:last:col-span-1">
              <EntryCard entry={entry} />
            </RevealItem>
          ))}
        </RevealStagger>
      </Container>
    </Section>
  );
}
