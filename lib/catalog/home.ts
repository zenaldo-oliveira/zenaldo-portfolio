import { getOfferPricing, getServiceOffer, getSolution, isOfferCustom } from "@/lib/catalog/data";
import type { Availability, FeatureId, Pricing, ServiceOfferDef, ServiceOfferId, ServiceResourceId } from "@/lib/catalog/data";

// Estrutura da Home comercial: as três entradas, as prévias e a tabela do
// que o cliente recebe. Os textos ficam em t.commercial.home (entries /
// previews / receives), casados pelos ids abaixo; recursos, funcionalidades,
// disponibilidade e preços vêm do catálogo (lib/catalog/data.ts).

export type HomeEntryId = "landing" | "site" | "systems";
export type HomePreviewId = "landing" | "site" | "tool" | "app" | "prototype";

export type HomeEntryDef = {
  id: HomeEntryId;
  // Ofertas do catálogo (SERVICE_OFFERS) que a entrada representa.
  offers: readonly ServiceOfferId[];
  // Oferta cuja imagem (captura real ou ilustração) ilustra a entrada.
  imageOffer: ServiceOfferId;
  // Configurador: com o serviço marcado quando a entrada é uma oferta só;
  // sistemas abrem o configurador para escolher entre sob medida e automação.
  href: string;
};

export const HOME_ENTRIES: readonly HomeEntryDef[] = [
  { id: "landing", offers: ["landing"], imageOffer: "landing", href: "/build?service=landing" },
  { id: "site", offers: ["business-site"], imageOffer: "business-site", href: "/build?service=business-site" },
  { id: "systems", offers: ["automation-ai", "custom-saas"], imageOffer: "custom-saas", href: "/build" },
];

// Prévias: projetos com captura real (títulos de lib/projects/data.ts) e um
// protótipo ilustrativo (ilustração do catálogo), sempre identificado.
// `similar` abre o configurador com a oferta mais próxima do exemplo.
export type HomePreviewDef =
  | { id: HomePreviewId; kind: "project"; project: string; similar: ServiceOfferId }
  | { id: HomePreviewId; kind: "prototype"; offer: ServiceOfferId; similar: ServiceOfferId };

export const HOME_PREVIEWS: readonly HomePreviewDef[] = [
  { id: "landing", kind: "project", project: "Pet Shop Premium", similar: "landing" },
  { id: "site", kind: "project", project: "Barber Shop Premium", similar: "business-site" },
  { id: "tool", kind: "project", project: "Text To Voice AI", similar: "automation-ai" },
  { id: "app", kind: "project", project: "Dieta IA", similar: "custom-saas" },
  { id: "prototype", kind: "prototype", offer: "crm", similar: "crm" },
];

function entryOffers(entry: HomeEntryDef): ServiceOfferDef[] {
  return entry.offers.flatMap((id) => getServiceOffer(id) ?? []);
}

// "Sob medida" se qualquer oferta da entrada for sob medida.
export function isEntryCustom(entry: HomeEntryDef): boolean {
  return entryOffers(entry).some(isOfferCustom);
}

// Recursos das ofertas da entrada, sem repetição: os já entregues primeiro,
// depois os sob medida (ordem do catálogo dentro de cada grupo).
export function getEntryResources(entry: HomeEntryDef): { id: ServiceResourceId; implemented: boolean }[] {
  const seen = new Set<ServiceResourceId>();
  const unique = entryOffers(entry)
    .flatMap((offer) => offer.resources)
    .filter((resource) => !seen.has(resource.id) && seen.add(resource.id));
  return [...unique.filter((r) => r.implemented), ...unique.filter((r) => !r.implemented)];
}

// Tabela "O que você recebe": cada funcionalidade das ofertas das entradas
// (featureIds do catálogo), com a disponibilidade da solução a que pertence
// em cada entrada — ou null quando a entrada não a inclui.
export type ReceivesRow = { feature: FeatureId; cells: Record<HomeEntryId, Availability | null> };

function featureAvailability(entry: HomeEntryDef, feature: FeatureId): Availability | null {
  const offer = entryOffers(entry).find((item) => item.featureIds.includes(feature));
  if (!offer) return null;
  return getSolution(offer.solutionId)?.availability ?? "custom";
}

export function getReceivesRows(): ReceivesRow[] {
  const features = [...new Set(HOME_ENTRIES.flatMap((entry) => entryOffers(entry).flatMap((offer) => offer.featureIds)))];
  return features.map((feature) => ({
    feature,
    cells: Object.fromEntries(HOME_ENTRIES.map((entry) => [entry.id, featureAvailability(entry, feature)])) as Record<HomeEntryId, Availability | null>,
  }));
}

// Cobrança da entrada: o preço confirmado no catálogo (null = "Sob
// consulta"); entradas sob medida não têm preço — dependem de escopo.
export function getEntryPricing(entry: HomeEntryDef): Pricing | null {
  if (isEntryCustom(entry)) return null;
  const offer = entryOffers(entry)[0];
  return offer ? getOfferPricing(offer) : null;
}
