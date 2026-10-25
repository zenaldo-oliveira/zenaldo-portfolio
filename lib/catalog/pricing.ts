import { ADDONS, FEATURE_PRICING, getBarberPackage, getPlan, getSolution } from "@/lib/catalog/data";
import type { AddonId, BarberPackageId, FeatureId, PlanId, Price, Pricing, SolutionId } from "@/lib/catalog/data";

// Seleção do "Montar meu projeto". Só ids — nunca valores: qualquer preço é
// lido do catálogo. Pura e sem dependência do navegador, para que um
// endpoint futuro recalcule o orçamento no servidor a partir dos mesmos ids
// (nunca confiar em valores enviados pelo navegador).
export type ProjectSelection = {
  solutionId: SolutionId;
  featureIds: readonly string[];
  addonIds: readonly string[];
  // Pacote de segmento (ex.: barbearia Prime), quando o fluxo veio dele.
  packageId?: string | null;
};

export type QuoteLine =
  | { kind: "package"; id: BarberPackageId; pricing: Pricing }
  | { kind: "plan"; id: PlanId; pricing: Pricing }
  | { kind: "feature"; id: FeatureId; pricing: Pricing }
  | { kind: "addon"; id: AddonId; pricing: Pricing };

export type Quote = {
  solutionId: SolutionId;
  requiresScope: boolean;
  lines: QuoteLine[];
  // Total só existe quando TODOS os itens têm valor confirmado; senão null
  // (o total é "Sob consulta" — nunca uma soma parcial apresentada como total).
  totals: Pricing;
};

function sum(values: Price[]): Price {
  if (values.some((value) => value === null)) return null;
  return values.reduce<number>((total, value) => total + (value ?? 0), 0);
}

export function quoteSelection(selection: ProjectSelection): Quote | null {
  const solution = getSolution(selection.solutionId);
  if (!solution) return null;

  // Whitelist: só funcionalidades da própria solução e adicionais do plano.
  const plan = solution.planId ? getPlan(solution.planId) : undefined;
  const featureIds = solution.features.filter((id) => selection.featureIds.includes(id));
  const addonIds = (plan?.addons ?? []).filter((id) => selection.addonIds.includes(id));
  // Pacote só vale para a solução a que pertence.
  const pack = getBarberPackage(selection.packageId);
  const packageLine = pack && pack.solutionId === solution.id ? pack : undefined;

  const lines: QuoteLine[] = [
    ...(packageLine ? [{ kind: "package" as const, id: packageLine.id, pricing: packageLine.pricing }] : []),
    ...(plan ? [{ kind: "plan" as const, id: plan.id, pricing: plan.pricing }] : []),
    ...featureIds.map((id) => ({ kind: "feature" as const, id, pricing: FEATURE_PRICING[id] })),
    ...addonIds.map((id) => ({
      kind: "addon" as const,
      id,
      pricing: ADDONS.find((addon) => addon.id === id)?.pricing ?? { setup: null, monthly: null },
    })),
  ];

  const requiresScope = solution.availability === "custom";

  return {
    solutionId: solution.id,
    requiresScope,
    lines,
    totals: requiresScope
      ? { setup: null, monthly: null }
      : {
          setup: sum(lines.map((line) => line.pricing.setup)),
          monthly: sum(lines.map((line) => line.pricing.monthly)),
        },
  };
}

export function formatPrice(value: Price, locale: string, onRequest: string): string {
  if (value === null) return onRequest;
  return new Intl.NumberFormat(locale, { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);
}
