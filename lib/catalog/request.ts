import { BARBER_SEGMENT, getBarberPackage, getServiceOffer, getSolution, isSolutionId, LOCAL_SERVICES_SEGMENT } from "@/lib/catalog/data";
import type { BarberPackageId, Price, ServiceOfferId, SolutionId } from "@/lib/catalog/data";
import type { Quote } from "@/lib/catalog/pricing";
import { normalizeWhatsapp } from "@/lib/leads/normalizeWhatsapp";
import type { CommercialCopy } from "@/lib/i18n/commercial-types";

// Estado e regras do "Montar meu projeto" — puros (sem React), reutilizáveis
// e testáveis.

export type BuilderContact = {
  name: string;
  whatsapp: string;
  email: string;
  company: string;
  segment: string;
};

export type BuilderState = {
  solutionId: SolutionId | null;
  // Pacote de segmento escolhido num card (ex.: barbearia Prime).
  packageId: BarberPackageId | null;
  // Serviço escolhido num card da vitrine (ex.: Landing pages).
  serviceId: ServiceOfferId | null;
  featureIds: string[];
  addonIds: string[];
  details: string;
  contact: BuilderContact;
};

export type BuilderStep = 0 | 1 | 2 | 3;

export type BuilderErrorKey = "solution" | "needs" | "name" | "whatsapp" | "email" | "company";

export const MIN_DETAILS_LENGTH = 10;
export const MAX_DETAILS_LENGTH = 1000;
export const MAX_FIELD_LENGTH = 120;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const EMPTY_CONTACT: BuilderContact = { name: "", whatsapp: "", email: "", company: "", segment: "" };

// Estado inicial a partir da URL: ?solution=<id>; ?service=<id> (card da
// vitrine) ou ?package=<id> (card de barbearia) marcam a solução e as
// funcionalidades do card; ?segment=barbearia ou servicos-locais preenche o
// segmento. Valores desconhecidos são ignorados.
export function initialBuilderState(
  params: { solution: string | null; service: string | null; package: string | null; segment: string | null },
  segmentNames: { barber: string; localServices: string },
): BuilderState {
  const pack = getBarberPackage(params.package);
  const segmentName =
    params.segment === BARBER_SEGMENT || pack ? segmentNames.barber
    : params.segment === LOCAL_SERVICES_SEGMENT ? segmentNames.localServices
    : "";
  const offer = pack ? undefined : getServiceOffer(params.service);
  const solutionId = pack?.solutionId ?? offer?.solutionId ?? (isSolutionId(params.solution) ? params.solution : null);
  return {
    solutionId,
    packageId: pack?.id ?? null,
    serviceId: offer?.id ?? null,
    featureIds: [...(pack?.featureIds ?? offer?.featureIds ?? [])],
    addonIds: [],
    details: "",
    contact: { ...EMPTY_CONTACT, segment: segmentName },
  };
}

// Erros da etapa, na ordem dos campos (o primeiro recebe o foco).
export function validateStep(step: BuilderStep, state: BuilderState): BuilderErrorKey[] {
  if (step === 0) return state.solutionId ? [] : ["solution"];

  if (step === 1) {
    const hasNeeds = state.featureIds.length > 0 || state.details.trim().length >= MIN_DETAILS_LENGTH;
    return hasNeeds ? [] : ["needs"];
  }

  if (step === 2) {
    const { name, whatsapp, email, company } = state.contact;
    const errors: BuilderErrorKey[] = [];
    if (name.trim().length < 2) errors.push("name");
    if (!normalizeWhatsapp(whatsapp)) errors.push("whatsapp");
    if (email.trim() && !EMAIL_PATTERN.test(email.trim())) errors.push("email");
    if (company.trim().length < 2) errors.push("company");
    return errors;
  }

  return [];
}

// Ao trocar de solução, mantém só o que pertence à nova (o resto não faria
// sentido no resumo nem na mensagem).
export function selectSolution(state: BuilderState, solutionId: SolutionId, allowedAddons: readonly string[]): BuilderState {
  const solution = getSolution(solutionId);
  if (!solution) return state;
  const pack = getBarberPackage(state.packageId);
  const offer = getServiceOffer(state.serviceId);
  return {
    ...state,
    solutionId,
    packageId: pack && pack.solutionId === solutionId ? pack.id : null,
    serviceId: offer && offer.solutionId === solutionId ? offer.id : null,
    featureIds: state.featureIds.filter((id) => (solution.features as readonly string[]).includes(id)),
    addonIds: state.addonIds.filter((id) => allowedAddons.includes(id)),
  };
}

export function toggleId(ids: string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id];
}

type MessageInput = {
  state: BuilderState;
  quote: Quote;
  copy: CommercialCopy;
  format: (value: Price) => string;
};

// Mensagem organizada para o WhatsApp da ZTech (negrito no formato do
// WhatsApp). Não afirma valores que não estejam confirmados.
export function buildRequestMessage({ state, quote, copy, format }: MessageInput): string {
  const m = copy.builder.message;
  const solution = getSolution(quote.solutionId);
  const solutionName = copy.solutions[quote.solutionId].name;
  const availability = solution ? copy.availability[solution.availability].label : "";
  const features = state.featureIds.filter((id): id is keyof CommercialCopy["features"] => id in copy.features);
  const addons = state.addonIds.filter((id): id is keyof CommercialCopy["addons"] => id in copy.addons);
  const { name, whatsapp, email, company, segment } = state.contact;

  const estimate = quote.requiresScope
    ? copy.builder.scopeNote
    : `${copy.setupLabel}: ${format(quote.totals.setup)} · ${copy.monthlyLabel}: ${format(quote.totals.monthly)}`;

  const pack = state.packageId ? copy.barber.packages[state.packageId] : undefined;

  const lines = [
    `*${m.title}*`,
    "",
    ...(pack ? [`*${copy.barber.packageLabel}:* ${copy.barber.segmentName} · ${pack.name}`] : []),
    ...(state.serviceId ? [`*${copy.showcase.serviceLabel}:* ${copy.showcase.offers[state.serviceId].name}`] : []),
    `*${m.solution}:* ${solutionName} (${availability})`,
    ...(features.length ? ["", `*${m.needs}:*`, ...features.map((id) => `- ${copy.features[id]}`)] : []),
    ...(addons.length ? ["", `*${m.addons}:*`, ...addons.map((id) => `- ${copy.addons[id].name}`)] : []),
    ...(state.details.trim() ? ["", `*${m.details}:*`, state.details.trim()] : []),
    "",
    `*${m.estimate}:* ${estimate}`,
    "",
    `*${m.contact}*`,
    `${m.name}: ${name.trim()}`,
    `${m.company}: ${company.trim()}`,
    ...(segment.trim() ? [`${m.segment}: ${segment.trim()}`] : []),
    `${m.whatsapp}: ${whatsapp.trim()}`,
    ...(email.trim() ? [`${m.email}: ${email.trim()}`] : []),
  ];

  return lines.join("\n");
}
