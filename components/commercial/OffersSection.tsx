"use client";

import Image from "next/image";
import { ArrowRight, BellRing, Check, MessageCircle, Wrench } from "lucide-react";
import { AgendaMockup } from "@/components/commercial/BarberMockups";
import { usePriceFormatter } from "@/components/commercial/usePriceFormatter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Tabs } from "@/components/ui/Tabs";
import { getOfferPricing, isOfferCustom, OFFER_FAMILIES, SERVICE_OFFERS } from "@/lib/catalog/data";
import type { ServiceOfferDef } from "@/lib/catalog/data";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import { OFFER_SCREENSHOTS as SCREENSHOTS } from "@/lib/media/screenshots";
import { PROJECTS } from "@/lib/projects/data";

const LABEL_CLASS = "font-mono text-[11px] uppercase tracking-wider text-text-muted";
// Zoom discreto da imagem no hover do card (sem alterar o layout).
const ZOOM = "transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100";

// Gestão de clientes (ilustração): lista com etapas e lembrete — só formas.
function CrmMockup() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border-strong bg-surface shadow-2xl shadow-black/30">
      <div className="flex h-5 items-center gap-1 border-b border-border bg-surface-strong px-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-border-strong" />
        <span className="h-1.5 w-1.5 rounded-full bg-border-strong" />
        <span className="h-1.5 w-1.5 rounded-full bg-border-strong" />
      </div>
      <div className="grid grid-cols-3 gap-2 p-3">
        {[0, 1, 2].map((column) => (
          <div key={column} className="space-y-1.5 rounded-md border border-border p-1.5">
            <div className={`h-1.5 w-2/3 rounded-full ${column === 1 ? "bg-accent/70" : "bg-border-strong"}`} />
            {[0, 1, 2].slice(0, 3 - column).map((row) => (
              <div key={row} className="space-y-1 rounded border border-border bg-surface-strong p-1.5">
                <div className="h-1 w-3/4 rounded-full bg-border-strong" />
                <div className="h-1 w-1/2 rounded-full bg-border-strong/70" />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="mx-3 mb-3 flex items-center gap-1.5 rounded-md border border-border-accent bg-accent/10 px-2 py-1.5">
        <BellRing size={11} className="text-accent" />
        <div className="h-1 w-24 rounded-full bg-accent/50" />
      </div>
    </div>
  );
}

// Catálogo digital (ilustração): só formas, sem produtos ou preços inventados.
function CatalogMockup() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border-strong bg-surface shadow-2xl shadow-black/30">
      <div className="flex h-5 items-center gap-1 border-b border-border bg-surface-strong px-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-border-strong" />
        <span className="h-1.5 w-1.5 rounded-full bg-border-strong" />
        <span className="h-1.5 w-1.5 rounded-full bg-border-strong" />
      </div>
      <div className="grid grid-cols-3 gap-2 p-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-md border border-border p-1.5">
            <div className={`aspect-square rounded ${i === 1 ? "bg-accent/25" : "bg-surface-strong"}`} />
            <div className="mt-1.5 h-1 w-3/4 rounded-full bg-border-strong" />
            <div className="mt-1 h-1 w-1/2 rounded-full bg-accent/50" />
          </div>
        ))}
      </div>
      <div className="mx-3 mb-3 flex h-6 items-center justify-center gap-1.5 rounded-md bg-[#25D366]/90 text-white">
        <MessageCircle size={11} />
        <span className="h-1 w-10 rounded-full bg-white/70" />
      </div>
    </div>
  );
}

// Imagem do card: captura real (rotulada com o projeto) ou ilustração
// (rotulada "Imagem ilustrativa"). Também usada em /plans.
export function OfferImage({ offer, alt }: { offer: ServiceOfferDef; alt: string }) {
  const s = useTranslations().commercial.showcase;
  const media = offer.media;
  const caption = media.kind === "illustration" ? s.illustrative : `${s.realProject} · ${media.project}`;
  const phone = media.kind === "phone" ? PROJECTS.find((project) => project.title === media.project)?.media : undefined;

  return (
    <div className="project-media relative aspect-16/10 w-full overflow-hidden border-b border-border">
      <span className="absolute left-3 top-3 z-10 rounded-full border border-border-strong bg-background/85 px-2.5 py-0.5 text-[11px] font-medium text-text-secondary backdrop-blur">
        {caption}
      </span>

      {media.kind === "screenshot" && (
        <div className={`absolute inset-x-[8%] top-[17%] overflow-hidden rounded-t-lg border border-b-0 border-border-strong shadow-2xl shadow-black/40 ${ZOOM}`}>
          <Image src={SCREENSHOTS[media.file]} alt={alt} placeholder="blur" sizes="(min-width: 1280px) 340px, (min-width: 640px) 45vw, 90vw" className="block h-auto w-full" />
        </div>
      )}

      {phone?.kind === "phone" && (
        <div className={`absolute inset-0 flex items-center justify-center gap-[6%] pt-[8%] ${ZOOM}`}>
          {phone.screens.map((screen, index) => (
            <div
              key={screen.src}
              className={`h-[78%] overflow-hidden rounded-[12px] border-[3px] border-black/85 bg-black shadow-xl ${index === 1 ? "translate-y-[6%]" : ""}`}
              style={{ aspectRatio: `${screen.width} / ${screen.height}` }}
            >
              <Image src={screen} alt={index === 0 ? alt : ""} placeholder="blur" sizes="120px" className="h-full w-full object-cover object-top" />
            </div>
          ))}
        </div>
      )}

      {media.kind === "illustration" && (
        <div role="img" aria-label={alt} className={`absolute inset-x-[12%] top-[18%] ${ZOOM}`}>
          <div aria-hidden="true">{media.mockup === "agenda" ? <AgendaMockup /> : media.mockup === "crm" ? <CrmMockup /> : <CatalogMockup />}</div>
        </div>
      )}
    </div>
  );
}

// headingAs: h4 dentro de painéis de abas (padrão); h3 direto sob o H2 da seção.
export function OfferCard({ offer, segment, headingAs = "h4" }: { offer: ServiceOfferDef; segment?: string; headingAs?: "h3" | "h4" }) {
  const t = useTranslations();
  const c = t.commercial;
  const s = c.showcase;
  const copy = s.offers[offer.id];
  const format = usePriceFormatter();
  const isCustom = isOfferCustom(offer);
  const pricing = getOfferPricing(offer);
  const hasPrice = pricing.setup !== null || pricing.monthly !== null;

  return (
    <Card
      className="group h-full transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-border-accent hover:shadow-xl hover:shadow-black/15 focus-within:border-border-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <OfferImage offer={offer} alt={copy.imageAlt} />

      <CardHeader>
        <Badge variant={isCustom ? "outline" : "default"}>
          {isCustom && <Wrench size={11} aria-hidden="true" />}
          {isCustom ? s.customLabel : c.availability.available.label}
        </Badge>
        <CardTitle as={headingAs} className="mt-1 text-text-primary">
          {copy.name}
        </CardTitle>
        <CardDescription>{copy.benefit}</CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        <p className={LABEL_CLASS}>{s.receivesLabel}</p>
        <ul className="mt-2 space-y-1.5 text-sm">
          {offer.resources.slice(0, 3).map((resource) => (
            <li key={resource.id} className="flex items-start gap-2 text-text-secondary">
              <Check size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
              <span>
                {s.resources[resource.id]}
                {!resource.implemented && !isCustom && (
                  <span className="ml-1.5 whitespace-nowrap rounded border border-border px-1.5 py-px text-[0.625rem] font-medium uppercase tracking-wide text-text-muted">
                    {s.customLabel}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>

        {/* Implantação e mensalidade só quando confirmadas no catálogo. */}
        <div className="mt-5 border-t border-border pt-4">
          {hasPrice ? (
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {pricing.setup !== null && (
                <div>
                  <dt className={LABEL_CLASS}>{c.setupLabel}</dt>
                  <dd className="mt-0.5 font-semibold text-text-primary">{format(pricing.setup)}</dd>
                </div>
              )}
              {pricing.monthly !== null && (
                <div>
                  <dt className={LABEL_CLASS}>{c.monthlyLabel}</dt>
                  <dd className="mt-0.5 font-semibold text-text-primary">{format(pricing.monthly)}</dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="text-sm font-medium text-text-primary">{s.requestProposal}</p>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-5">
        <Button href={`/build?service=${offer.id}${segment ? `&segment=${segment}` : ""}`} className="w-full">
          {copy.cta}
          <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </Button>
      </CardFooter>
    </Card>
  );
}

// Ofertas da Home: três frentes (Presença, Operação, Sob medida) em abas.
// Cada aba mostra o benefício da frente e os cards de serviço do catálogo
// (SERVICE_OFFERS, agrupados em OFFER_FAMILIES) — entrada suave uma única
// vez (Reveal), hover só como reforço, tudo acionável sem hover.
type OffersSectionProps = {
  id?: string;
  // /services: abas e títulos pela necessidade do cliente.
  byNeed?: boolean;
  heading?: { eyebrow: string; title: string; description: string };
  showViewAll?: boolean;
};

export function OffersSection({ id = "solucoes", byNeed = false, heading, showViewAll = true }: OffersSectionProps = {}) {
  const t = useTranslations();
  const o = t.commercial.home.offers;
  const header = heading ?? { eyebrow: o.eyebrow, title: o.title, description: o.description };

  const items = OFFER_FAMILIES.map((family) => ({
    id: family.id,
    label: byNeed ? o.families[family.id].need : o.families[family.id].tab,
    panel: (
      <div>
        <div className="mb-6 max-w-2xl">
          <h3 className="text-xl font-semibold tracking-tight text-text-primary">
            {byNeed ? o.families[family.id].need : o.families[family.id].name}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-text-secondary sm:text-base">{o.families[family.id].benefit}</p>
        </div>
        <ul className={`grid gap-5 sm:grid-cols-2 ${family.offers.length === 3 ? "xl:grid-cols-3" : "xl:max-w-4xl"}`}>
          {family.offers.map((id) => {
            const offer = SERVICE_OFFERS.find((item) => item.id === id);
            return offer ? (
              <li key={id}>
                <OfferCard offer={offer} />
              </li>
            ) : null;
          })}
        </ul>
      </div>
    ),
  }));

  return (
    <Section id={id}>
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader eyebrow={header.eyebrow} title={header.title} description={header.description} className="mb-0" />
          {showViewAll && (
            <Button href="/services" variant="link" className="shrink-0 self-start sm:self-auto">
              {t.commercial.showcase.viewAll}
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
          )}
        </div>
        <Reveal className="mt-(--space-header-gap)">
          <Tabs label={o.tablistLabel} items={items} />
        </Reveal>
      </Container>
    </Section>
  );
}
