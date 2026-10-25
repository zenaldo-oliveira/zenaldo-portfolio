"use client";

import { ArrowRight, Check, Repeat, Rocket } from "lucide-react";
import { AvailabilityBadge } from "@/components/commercial/AvailabilityBadge";
import { OfferImage } from "@/components/commercial/OffersSection";
import { usePriceFormatter } from "@/components/commercial/usePriceFormatter";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import { AnimatedH1 } from "@/components/ui/AnimatedH1";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { ADDONS, EXTERNAL_COSTS, getOfferAddons, getOfferPricing, getServiceOffer, PLANS_SHOWCASE } from "@/lib/catalog/data";
import type { Pricing, PlansOfferId, PlansSiteOfferId, ServiceOfferDef } from "@/lib/catalog/data";
import { useTranslations } from "@/lib/i18n/LanguageContext";

const LABEL_CLASS = "font-mono text-[11px] uppercase tracking-wider text-text-muted";
// Âncoras usadas por /services (#plan-sites no grupo, #plan-automation no card).
const ANCHORS: Partial<Record<PlansOfferId, string>> = { "automation-ai": "plan-automation" };

function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-2 space-y-1.5 text-sm">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-text-secondary">
          <Check size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
          {item}
        </li>
      ))}
    </ul>
  );
}

// Implantação e mensalidade em linhas separadas — nunca somadas num valor só.
function PriceRows({ pricing }: { pricing: Pricing }) {
  const t = useTranslations();
  const format = usePriceFormatter(t.commercial.showcase.requestProposal);

  return (
    <dl className="grid grid-cols-2 divide-x divide-border rounded-xl border border-border bg-background/40">
      <div className="p-3">
        <dt className={LABEL_CLASS}>{t.commercial.setupLabel}</dt>
        <dd className="mt-1 text-base font-semibold text-text-primary">{format(pricing.setup)}</dd>
      </div>
      <div className="p-3">
        <dt className={LABEL_CLASS}>{t.commercial.monthlyLabel}</dt>
        <dd className="mt-1 text-base font-semibold text-text-primary">{format(pricing.monthly)}</dd>
      </div>
    </dl>
  );
}

// Ficha de contratação de um site (escopo padrão): imagem real, público,
// entregas, limites confirmados, suporte, adicionais, valores e CTA.
function SiteSheet({ offer, id }: { offer: ServiceOfferDef; id: PlansSiteOfferId }) {
  const t = useTranslations();
  const c = t.commercial;
  const page = c.plansPage;
  const copy = page.offers[id];
  const details = page.siteDetails[id];
  const addons = getOfferAddons(offer);
  const titleId = `oferta-${id}-titulo`;

  return (
    <article
      id={`oferta-${id}`}
      aria-labelledby={titleId}
      className="grid scroll-mt-24 overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-300 hover:border-border-accent lg:grid-cols-2"
    >
      <div className="flex flex-col">
        <OfferImage offer={offer} alt={c.showcase.offers[id].imageAlt} />
        <div className="p-6 sm:p-7">
          <AvailabilityBadge availability="available" />
          <h3 id={titleId} className="mt-3 text-2xl font-semibold tracking-tight text-text-primary">
            {copy.name}
          </h3>
          <p className={`mt-4 ${LABEL_CLASS}`}>{page.audienceLabel}</p>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary sm:text-base">{copy.audience}</p>
        </div>
      </div>

      <div className="flex flex-col border-t border-border p-6 sm:p-7 lg:border-l lg:border-t-0">
        <p className={LABEL_CLASS}>{page.receivesLabel}</p>
        <CheckList items={details.receives} />
        <dl className="mt-6 space-y-5 text-sm">
          <div>
            <dt className={LABEL_CLASS}>{page.limitsLabel}</dt>
            <dd>
              <CheckList items={details.limits} />
              <p className="mt-2 text-text-muted">{page.limitsNote}</p>
            </dd>
          </div>
          <div>
            <dt className={LABEL_CLASS}>{page.supportLabel}</dt>
            <dd className="mt-1 text-text-secondary">{page.supportValue}</dd>
          </div>
          {addons.length > 0 && (
            <div>
              <dt className={LABEL_CLASS}>{page.addonsLabel}</dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">
                {addons.map((addonId) => (
                  <span key={addonId} className="rounded-md border border-border px-2 py-0.5 text-xs text-text-secondary">
                    {c.addons[addonId].name}
                  </span>
                ))}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-auto space-y-4 pt-7">
          <PriceRows pricing={getOfferPricing(offer)} />
          <Button href={`/build?service=${id}`} className="w-full">
            {c.showcase.offers[id].cta}
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </article>
  );
}

// Card de sistema/automação: escopo não padronizado → "Sob medida", sem
// valor; o que pode incluir vem dos recursos do catálogo.
function SystemCard({ offer, id }: { offer: ServiceOfferDef; id: PlansOfferId }) {
  const t = useTranslations();
  const c = t.commercial;
  const page = c.plansPage;
  const titleId = `oferta-${id}-titulo`;

  return (
    <article
      id={ANCHORS[id] ?? `oferta-${id}`}
      aria-labelledby={titleId}
      className="group flex h-full scroll-mt-24 flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-[transform,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-border-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <OfferImage offer={offer} alt={c.showcase.offers[id].imageAlt} />
      <div className="flex flex-1 flex-col p-6">
        <AvailabilityBadge availability="custom" />
        <h3 id={titleId} className="mt-3 text-xl font-semibold tracking-tight text-text-primary">
          {page.offers[id].name}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{page.offers[id].audience}</p>
        <p className={`mt-5 ${LABEL_CLASS}`}>{page.mayIncludeLabel}</p>
        <CheckList items={offer.resources.map((resource) => c.showcase.resources[resource.id])} />
        <p className="mt-5 border-t border-border pt-4 text-sm font-medium text-text-primary">{page.customPrice}</p>
        <div className="mt-auto pt-5">
          <Button href={`/build?service=${id}`} variant="secondary" className="w-full">
            {c.showcase.offers[id].cta}
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </article>
  );
}

// /plans: vitrine de contratação. Sites (escopo padrão) em fichas completas;
// sistemas e automações sob medida. Tudo vem do catálogo (lib/catalog) —
// valor não confirmado aparece como "Solicitar proposta".
export function PlansContent() {
  const t = useTranslations();
  const c = t.commercial;
  const page = c.plansPage;
  const format = usePriceFormatter(c.showcase.requestProposal);

  return (
    <>
      {/* Hero */}
      <Section variant="hero">
        <Container>
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              {page.eyebrow}
            </p>
            <AnimatedH1 className="mt-5 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-5xl" text={page.title} />
            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">{page.description}</p>
          </div>

          {/* Modelo de cobrança */}
          <div className="mt-10">
            <p className={LABEL_CLASS}>{page.modelTitle}</p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {[
                { Icon: Rocket, label: c.setupLabel, text: page.modelSetup },
                { Icon: Repeat, label: c.monthlyLabel, text: page.modelMonthly },
              ].map(({ Icon, label, text }) => (
                <div key={label} className="flex gap-4 rounded-xl border border-border bg-surface/70 p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-accent bg-accent/10 text-accent">
                    <Icon size={17} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{label}</p>
                    <p className="mt-1 text-sm leading-relaxed text-text-secondary">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Sites: escopo padrão */}
      <Section id="plan-sites">
        <Container>
          <SectionHeader eyebrow={page.sitesEyebrow} title={page.sitesTitle} description={page.sitesDescription} />
          <div className="space-y-6">
            {PLANS_SHOWCASE.sites.map((id, index) => {
              const offer = getServiceOffer(id);
              return offer ? (
                <Reveal key={id} delay={index * 0.05}>
                  <SiteSheet offer={offer} id={id} />
                </Reveal>
              ) : null;
            })}
          </div>
        </Container>
      </Section>

      {/* Sistemas e automações: sob medida */}
      <Section id="sistemas">
        <Container>
          <SectionHeader eyebrow={page.systemsEyebrow} title={page.systemsTitle} description={page.systemsDescription} />
          <ul className="grid gap-5 md:grid-cols-2">
            {PLANS_SHOWCASE.systems.map((id, index) => {
              const offer = getServiceOffer(id);
              return offer ? (
                <li key={id}>
                  <Reveal delay={(index % 2) * 0.05} className="h-full">
                    <SystemCard offer={offer} id={id} />
                  </Reveal>
                </li>
              ) : null;
            })}
          </ul>

          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-surface/70 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="font-semibold text-text-primary">{page.otherTitle}</p>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">{page.otherDescription}</p>
            </div>
            <Button href="/services#detalhes" variant="link" className="shrink-0 self-start sm:self-auto">
              {page.otherCta}
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </div>
        </Container>
      </Section>

      {/* Adicionais */}
      <Section id="adicionais">
        <Container>
          <SectionHeader title={page.addonsTitle} description={page.addonsDescription} />
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <thead className="bg-surface">
                <tr>
                  <th scope="col" className={`px-4 py-3 ${LABEL_CLASS}`}>{page.addonsTitle}</th>
                  <th scope="col" className={`px-4 py-3 ${LABEL_CLASS}`}>{c.setupLabel}</th>
                  <th scope="col" className={`px-4 py-3 ${LABEL_CLASS}`}>{c.monthlyLabel}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ADDONS.map((addon) => (
                  <tr key={addon.id}>
                    <th scope="row" className="px-4 py-3 align-top font-normal">
                      <span className="block font-medium text-text-primary">{c.addons[addon.id].name}</span>
                      <span className="mt-0.5 block text-text-secondary">{c.addons[addon.id].description}</span>
                    </th>
                    <td className="px-4 py-3 align-top text-text-primary">{format(addon.pricing.setup)}</td>
                    <td className="px-4 py-3 align-top text-text-primary">{format(addon.pricing.monthly)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      {/* Custos externos */}
      <Section id="custos-externos" variant="compact">
        <Container>
          <SectionHeader title={page.externalTitle} description={page.externalDescription} />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {EXTERNAL_COSTS.map((id) => (
              <li key={id} className="rounded-xl border border-border bg-surface/70 p-4">
                <p className="text-sm font-semibold text-text-primary">{c.externalCosts[id].name}</p>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">{c.externalCosts[id].description}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-text-muted">{page.paymentNote}</p>
        </Container>
      </Section>

      <FinalCtaSection />
    </>
  );
}
