// Catálogo comercial da ZTech: soluções, planos, adicionais e custos
// externos. Fonte única para /services, /plans, /build e Home — os textos
// (nomes, descrições, entregas) ficam em t.commercial, casados pelos ids
// abaixo; aqui fica só a estrutura e os valores.
//
// PREÇOS: nenhum valor está confirmado ainda. `null` significa
// "Sob consulta" e é assim que aparece em todo o site. Para publicar um
// valor, troque o null pelo número em reais (ex.: setup: 1500) — os cards,
// o resumo do "Montar meu projeto" e a mensagem do WhatsApp passam a
// mostrá-lo sem nenhuma outra mudança. Nunca preencher um valor que não foi
// confirmado comercialmente.

export type SolutionId = "sites" | "catalog" | "crm" | "automation" | "ai" | "custom" | "erp-saas";

// available: entrega com escopo padrão, contratável por plano.
// custom: desenvolvimento sob medida — exige diagnóstico e definição de
// escopo antes de qualquer valor.
export type Availability = "available" | "custom";

export type PlanId = "sites" | "automation";

export type FeatureId =
  | "sites-landing"
  | "sites-multipage"
  | "sites-whatsapp-form"
  | "sites-seo"
  | "sites-blog"
  | "catalog-products"
  | "catalog-cart-whatsapp"
  | "catalog-admin"
  | "catalog-categories"
  | "crm-pipeline"
  | "crm-contacts"
  | "crm-followups"
  | "crm-reports"
  | "automation-forms"
  | "automation-whatsapp"
  | "automation-sheets"
  | "automation-notifications"
  | "ai-assistant"
  | "ai-documents"
  | "ai-classification"
  | "custom-web"
  | "custom-mobile"
  | "custom-integrations"
  | "erp-modules"
  | "erp-multitenant"
  | "erp-billing";

export type AddonId = "domain-setup" | "extra-pages" | "content-writing" | "training" | "integration" | "extra-hours";

export type ExternalCostId = "domain" | "email" | "ai-usage" | "whatsapp-api" | "third-party";

// Valor em reais (inteiro) ou null = "Sob consulta".
export type Price = number | null;

export type Pricing = {
  setup: Price; // implantação (pagamento único)
  monthly: Price; // mensalidade
};

// Ilustrações já existentes em components/services/SolutionVisuals.
// "app" mostra o Dieta IA (app real) — só para soluções sob medida.
export type SolutionVisual = "web" | "app" | "system" | "integrations" | "saas" | "flow";

export type SolutionDef = {
  id: SolutionId;
  availability: Availability;
  planId?: PlanId;
  visual: SolutionVisual;
  features: readonly FeatureId[];
  // Projetos reais (títulos de lib/projects/data.ts) que mostram o tipo de
  // trabalho — só quando a relação é verdadeira.
  projects: readonly string[];
};

export const SOLUTIONS: readonly SolutionDef[] = [
  {
    id: "sites",
    availability: "available",
    planId: "sites",
    visual: "web",
    features: ["sites-landing", "sites-multipage", "sites-whatsapp-form", "sites-seo", "sites-blog"],
    projects: ["Pet Shop Premium", "Barber Shop Premium"],
  },
  {
    id: "catalog",
    // Sob medida até existir um produto padronizado confirmado para venda.
    availability: "custom",
    visual: "web",
    features: ["catalog-products", "catalog-categories", "catalog-cart-whatsapp", "catalog-admin"],
    projects: [],
  },
  {
    id: "crm",
    // Sob medida até existir um produto padronizado confirmado para venda.
    availability: "custom",
    visual: "system",
    features: ["crm-pipeline", "crm-contacts", "crm-followups", "crm-reports"],
    projects: [],
  },
  {
    id: "automation",
    availability: "available",
    planId: "automation",
    visual: "integrations",
    features: ["automation-forms", "automation-whatsapp", "automation-sheets", "automation-notifications"],
    projects: [],
  },
  {
    id: "ai",
    availability: "custom",
    visual: "flow",
    features: ["ai-assistant", "ai-documents", "ai-classification"],
    projects: ["Dieta IA", "Text To Voice AI"],
  },
  {
    id: "custom",
    availability: "custom",
    visual: "app",
    features: ["custom-web", "custom-mobile", "custom-integrations"],
    projects: ["ZLift Manager", "EasyCar Mobile"],
  },
  {
    id: "erp-saas",
    availability: "custom",
    visual: "saas",
    features: ["erp-modules", "erp-multitenant", "erp-billing"],
    projects: ["ZLift Manager"],
  },
];

export type PlanDef = {
  id: PlanId;
  solutionId: SolutionId;
  pricing: Pricing;
  addons: readonly AddonId[];
};

export const PLANS: readonly PlanDef[] = [
  { id: "sites", solutionId: "sites", pricing: { setup: null, monthly: null }, addons: ["domain-setup", "extra-pages", "content-writing"] },
  { id: "automation", solutionId: "automation", pricing: { setup: null, monthly: null }, addons: ["integration", "extra-hours"] },
];

// Funcionalidades: sem preço próprio enquanto não houver tabela confirmada
// (o valor depende do plano/escopo). Mantido no mesmo formato para quando
// existir.
export const FEATURE_PRICING: Record<FeatureId, Pricing> = Object.fromEntries(
  SOLUTIONS.flatMap((solution) => solution.features).map((id) => [id, { setup: null, monthly: null }]),
) as Record<FeatureId, Pricing>;

export type AddonDef = { id: AddonId; pricing: Pricing };

export const ADDONS: readonly AddonDef[] = [
  { id: "domain-setup", pricing: { setup: null, monthly: null } },
  { id: "extra-pages", pricing: { setup: null, monthly: null } },
  { id: "content-writing", pricing: { setup: null, monthly: null } },
  { id: "training", pricing: { setup: null, monthly: null } },
  { id: "integration", pricing: { setup: null, monthly: null } },
  { id: "extra-hours", pricing: { setup: null, monthly: null } },
];

// Custos de terceiros: nunca entram nos valores da ZTech exibidos no site.
export const EXTERNAL_COSTS: readonly ExternalCostId[] = ["domain", "email", "ai-usage", "whatsapp-api", "third-party"];

export function getSolution(id: string): SolutionDef | undefined {
  return SOLUTIONS.find((solution) => solution.id === id);
}

export function getPlan(id: PlanId): PlanDef {
  const plan = PLANS.find((item) => item.id === id);
  if (!plan) throw new Error(`Plano desconhecido: ${id}`);
  return plan;
}

export function isSolutionId(value: unknown): value is SolutionId {
  return typeof value === "string" && SOLUTIONS.some((solution) => solution.id === value);
}

// ===== Segmento: barbearias =====
// Pacotes da seção "Soluções para sua barbearia" (/services#barbearia). Cada
// recurso diz se já é entregue hoje (implemented) ou se seria desenvolvido
// sob medida — o site nunca apresenta como pronto o que ainda não existe.
// Presença usa o plano de sites (landing page, já entregue); Agenda e Prime
// dependem de desenvolvimento e entram como sistema sob medida (exigem escopo).
export const BARBER_SEGMENT = "barbearia";

export type BarberPackageId = "presence" | "agenda" | "prime";

export type BarberResourceId =
  | "services"
  | "prices"
  | "gallery"
  | "location"
  | "whatsapp"
  | "booking"
  | "booking-time"
  | "admin"
  | "agenda-all"
  | "subscription-plans"
  | "recurring-billing"
  | "usage-control";

export type BarberPackageDef = {
  id: BarberPackageId;
  solutionId: SolutionId;
  featureIds: readonly FeatureId[];
  // Mesmo formato dos planos: null = não confirmado ("Solicitar proposta").
  pricing: Pricing;
  resources: readonly { id: BarberResourceId; implemented: boolean }[];
};

export const BARBER_PACKAGES: readonly BarberPackageDef[] = [
  {
    id: "presence",
    solutionId: "sites",
    featureIds: ["sites-landing", "sites-whatsapp-form", "sites-seo"],
    pricing: { setup: null, monthly: null },
    resources: [
      { id: "services", implemented: true },
      { id: "prices", implemented: true },
      { id: "gallery", implemented: true },
      { id: "location", implemented: true },
      { id: "whatsapp", implemented: true },
    ],
  },
  {
    id: "agenda",
    solutionId: "custom",
    featureIds: ["custom-web"],
    pricing: { setup: null, monthly: null },
    resources: [
      { id: "booking", implemented: false },
      { id: "booking-time", implemented: false },
      { id: "admin", implemented: false },
    ],
  },
  {
    id: "prime",
    solutionId: "custom",
    featureIds: ["custom-web"],
    pricing: { setup: null, monthly: null },
    resources: [
      { id: "agenda-all", implemented: false },
      { id: "subscription-plans", implemented: false },
      { id: "recurring-billing", implemented: false },
      { id: "usage-control", implemented: false },
    ],
  },
];

export function getBarberPackage(id: unknown): BarberPackageDef | undefined {
  return BARBER_PACKAGES.find((item) => item.id === id);
}

// ===== Vitrine de serviços (Home) =====
// Os 6 cards comerciais. Cada um aponta para uma solução e funcionalidades
// do catálogo acima (fonte única) — o card só escolhe o recorte, a imagem e
// o que destacar. Preço: o do plano da solução (null = "Solicitar
// proposta"); soluções sem plano dependem de escopo. `implemented: false`
// marca o recurso como "Sob medida".
export type ServiceOfferId =
  | "landing"
  | "business-site"
  | "booking"
  | "store"
  | "crm"
  | "custom-saas"
  | "automation-ai"
  | "service-orders";

export type ServiceResourceId =
  | "single-page"
  | "whatsapp-contact"
  | "search-setup"
  | "service-pages"
  | "contact-form"
  | "own-domain"
  | "booking-choice"
  | "booking-calendar"
  | "booking-panel"
  | "product-showcase"
  | "whatsapp-order"
  | "product-admin"
  | "web-system"
  | "mobile-app"
  | "subscriptions"
  | "customer-records"
  | "sales-pipeline"
  | "follow-ups"
  | "service-order-flow"
  | "field-records"
  | "service-reports"
  | "auto-records"
  | "team-alerts"
  | "ai-assistant";

// Captura real (arquivo em public/projects/screenshots) ou ilustração.
export type OfferMedia =
  | { kind: "screenshot"; project: string; file: "pet-shop-premium" | "barber-shop-premium" | "text-to-voice-ai" }
  | { kind: "phone"; project: string }
  | { kind: "illustration"; mockup: "agenda" | "catalog" | "crm" };

export type ServiceOfferDef = {
  id: ServiceOfferId;
  solutionId: SolutionId;
  featureIds: readonly FeatureId[];
  media: OfferMedia;
  resources: readonly { id: ServiceResourceId; implemented: boolean }[];
  // Preço do próprio card (não herda o do plano: escopos diferentes).
  // Ausente = não confirmado ("Solicitar proposta").
  pricing?: Pricing;
};

export const SERVICE_OFFERS: readonly ServiceOfferDef[] = [
  {
    id: "landing",
    solutionId: "sites",
    featureIds: ["sites-landing", "sites-whatsapp-form", "sites-seo"],
    media: { kind: "screenshot", project: "Pet Shop Premium", file: "pet-shop-premium" },
    resources: [
      { id: "single-page", implemented: true },
      { id: "whatsapp-contact", implemented: true },
      { id: "search-setup", implemented: true },
    ],
  },
  {
    id: "business-site",
    solutionId: "sites",
    featureIds: ["sites-multipage", "sites-whatsapp-form", "sites-seo"],
    media: { kind: "screenshot", project: "Barber Shop Premium", file: "barber-shop-premium" },
    resources: [
      { id: "service-pages", implemented: true },
      { id: "contact-form", implemented: true },
      { id: "own-domain", implemented: true },
    ],
  },
  {
    id: "booking",
    solutionId: "custom",
    featureIds: ["custom-web"],
    media: { kind: "illustration", mockup: "agenda" },
    resources: [
      { id: "booking-choice", implemented: false },
      { id: "booking-calendar", implemented: false },
      { id: "booking-panel", implemented: false },
    ],
  },
  {
    id: "store",
    solutionId: "catalog",
    featureIds: ["catalog-products", "catalog-cart-whatsapp", "catalog-admin"],
    media: { kind: "illustration", mockup: "catalog" },
    resources: [
      { id: "product-showcase", implemented: false },
      { id: "whatsapp-order", implemented: false },
      { id: "product-admin", implemented: false },
    ],
  },
  {
    id: "crm",
    solutionId: "crm",
    featureIds: ["crm-contacts", "crm-pipeline", "crm-followups"],
    media: { kind: "illustration", mockup: "crm" },
    resources: [
      { id: "customer-records", implemented: false },
      { id: "sales-pipeline", implemented: false },
      { id: "follow-ups", implemented: false },
    ],
  },
  {
    id: "custom-saas",
    solutionId: "custom",
    featureIds: ["custom-web", "custom-mobile"],
    media: { kind: "phone", project: "Dieta IA" },
    resources: [
      { id: "web-system", implemented: false },
      { id: "mobile-app", implemented: false },
      { id: "subscriptions", implemented: false },
    ],
  },
  {
    id: "automation-ai",
    solutionId: "automation",
    featureIds: ["automation-forms", "automation-whatsapp"],
    media: { kind: "screenshot", project: "Text To Voice AI", file: "text-to-voice-ai" },
    resources: [
      { id: "auto-records", implemented: true },
      { id: "team-alerts", implemented: true },
      { id: "ai-assistant", implemented: false },
    ],
  },
];

// Ordens de serviço: usada pelo segmento de serviços locais (não aparece
// nas famílias). Sistema sob medida — o ZLift Manager é a referência real.
const SERVICE_ORDERS_OFFER: ServiceOfferDef = {
  id: "service-orders",
  solutionId: "custom",
  featureIds: ["custom-web", "custom-integrations"],
  media: { kind: "illustration", mockup: "crm" },
  resources: [
    { id: "service-order-flow", implemented: false },
    { id: "field-records", implemented: false },
    { id: "service-reports", implemented: false },
  ],
};

export function getServiceOffer(id: unknown): ServiceOfferDef | undefined {
  if (id === SERVICE_ORDERS_OFFER.id) return SERVICE_ORDERS_OFFER;
  return SERVICE_OFFERS.find((item) => item.id === id);
}

// Preço exibido no card: só o confirmado no próprio card. Card com recurso
// ainda não entregue nunca mostra preço (depende de escopo).
export function getOfferPricing(offer: ServiceOfferDef): Pricing {
  if (isOfferCustom(offer)) return { setup: null, monthly: null };
  return offer.pricing ?? { setup: null, monthly: null };
}

// "Sob medida": solução sob medida ou qualquer recurso ainda não entregue.
export function isOfferCustom(offer: ServiceOfferDef): boolean {
  return getSolution(offer.solutionId)?.availability === "custom" || offer.resources.some((resource) => !resource.implemented);
}

// ===== Home: famílias de ofertas e segmentos =====
// As abas de Ofertas agrupam os cards da vitrine (SERVICE_OFFERS).
export type OfferFamilyId = "presence" | "operation" | "custom";

export const OFFER_FAMILIES: readonly { id: OfferFamilyId; offers: readonly ServiceOfferId[] }[] = [
  { id: "presence", offers: ["landing", "business-site"] },
  { id: "operation", offers: ["booking", "store", "crm"] },
  { id: "custom", offers: ["custom-saas", "automation-ai"] },
];

// ===== Planos e valores: vitrine de contratação =====
// Sites têm escopo padrão (fichas completas); os demais dependem de
// diagnóstico. Âncoras de /plans: #plan-sites e #plan-automation.
export const PLANS_SHOWCASE = {
  sites: ["landing", "business-site"],
  systems: ["booking", "store", "custom-saas", "automation-ai"],
} as const satisfies Record<string, readonly ServiceOfferId[]>;

export type PlansSiteOfferId = (typeof PLANS_SHOWCASE.sites)[number];
export type PlansOfferId = PlansSiteOfferId | (typeof PLANS_SHOWCASE.systems)[number];

// Adicionais do plano da solução da oferta (vazio se a solução não tem plano).
export function getOfferAddons(offer: ServiceOfferDef): readonly AddonId[] {
  const planId = getSolution(offer.solutionId)?.planId;
  return planId ? getPlan(planId).addons : [];
}

// Segmentos prioritários. `param` vai na URL do configurador
// (?segment=...) e preenche o segmento da empresa.
export type SegmentId = "local-services" | "barbershop";

export const LOCAL_SERVICES_SEGMENT = "servicos-locais";

export const SEGMENTS: readonly { id: SegmentId; param: string }[] = [
  { id: "local-services", param: LOCAL_SERVICES_SEGMENT },
  { id: "barbershop", param: BARBER_SEGMENT },
];

// Combinações recomendadas para serviços locais (climatização e manutenção):
// cada uma abre o configurador com um serviço do catálogo.
export type LocalComboId = "site-quotes" | "visit-booking" | "service-orders";

export const LOCAL_SERVICE_COMBOS: readonly { id: LocalComboId; serviceId: ServiceOfferId }[] = [
  { id: "site-quotes", serviceId: "business-site" },
  { id: "visit-booking", serviceId: "booking" },
  { id: "service-orders", serviceId: "service-orders" },
];
