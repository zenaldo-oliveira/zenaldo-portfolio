"use client";

import { ArrowRight, Check, Minus } from "lucide-react";
import { usePriceFormatter } from "@/components/commercial/usePriceFormatter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { StarBorder } from "@/components/ui/StarBorder";
import type { Availability } from "@/lib/catalog/data";
import { getEntryPricing, getReceivesRows, HOME_ENTRIES, isEntryCustom } from "@/lib/catalog/home";
import type { HomeEntryDef } from "@/lib/catalog/home";
import { useTranslations } from "@/lib/i18n/LanguageContext";

// Célula da tabela: incluído (✓), sob medida (selo) ou não incluído (—),
// sempre com texto para leitores de tela.
function AvailabilityMark({ value }: { value: Availability | null }) {
  const c = useTranslations().commercial;
  const r = c.home.receives;

  if (value === "available") {
    return (
      <span className="inline-flex items-center gap-1.5 text-accent">
        <Check size={17} aria-hidden="true" />
        <span className="sr-only">{r.included}</span>
      </span>
    );
  }
  if (value === "custom") return <Badge variant="outline">{c.showcase.customLabel}</Badge>;
  return (
    <span className="inline-flex text-text-muted/60">
      <Minus size={16} aria-hidden="true" />
      <span className="sr-only">{r.notIncluded}</span>
    </span>
  );
}

// Cobrança da entrada: valores do catálogo (null = "Sob consulta") ou, nas
// entradas sob medida, "Exige definição de escopo".
function useBillingLines(): (entry: HomeEntryDef) => string[] {
  const c = useTranslations().commercial;
  const format = usePriceFormatter();
  return (entry) => {
    const pricing = getEntryPricing(entry);
    if (!pricing) return [c.scopeRequired];
    return [`${c.setupLabel}: ${format(pricing.setup)}`, `${c.monthlyLabel}: ${format(pricing.monthly)}`];
  };
}

function EntryHeading({ entry }: { entry: HomeEntryDef }) {
  const c = useTranslations().commercial;
  const isCustom = isEntryCustom(entry);
  return (
    <>
      <span className="block text-base font-semibold tracking-tight text-text-primary">{c.home.entries.items[entry.id].name}</span>
      <Badge variant={isCustom ? "outline" : "default"} className="mt-2">
        {c.availability[isCustom ? "custom" : "available"].label}
      </Badge>
    </>
  );
}

// "O que você recebe" (estilo tabela de planos): funcionalidades do
// catálogo nas linhas, as três entradas nas colunas e a cobrança no rodapé.
// No celular, a mesma informação vira uma lista por entrada.
export function ReceivesSection() {
  const t = useTranslations();
  const c = t.commercial;
  const r = c.home.receives;
  const rows = getReceivesRows();
  const billing = useBillingLines();

  return (
    <Section id="entrega">
      <Container>
        <SectionHeader eyebrow={r.eyebrow} title={r.title} description={r.description} />

        <Reveal>
          {/* Desktop/tablet: tabela comparativa. */}
          <div className="hidden overflow-hidden rounded-2xl border border-border bg-surface md:block">
            <table className="w-full table-fixed border-collapse text-left text-sm">
              <caption className="sr-only">{r.tableCaption}</caption>
              <thead>
                <tr className="border-b border-border-strong">
                  <th scope="col" className="w-[34%] p-5 align-bottom font-mono text-[11px] font-normal uppercase tracking-wider text-text-muted">
                    {r.featureLabel}
                  </th>
                  {HOME_ENTRIES.map((entry) => (
                    <th key={entry.id} scope="col" className="p-5 align-bottom font-normal">
                      <EntryHeading entry={entry} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.feature} className="border-b border-border transition-colors duration-150 hover:bg-surface-strong/50">
                    <th scope="row" className="px-5 py-3.5 font-normal text-text-secondary">
                      {c.features[row.feature]}
                    </th>
                    {HOME_ENTRIES.map((entry) => (
                      <td key={entry.id} className="px-5 py-3.5">
                        <AvailabilityMark value={row.cells[entry.id]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-surface-strong/40">
                  <th scope="row" className="px-5 py-4 font-medium text-text-primary">
                    {r.billingLabel}
                  </th>
                  {HOME_ENTRIES.map((entry) => (
                    <td key={entry.id} className="px-5 py-4 text-text-secondary">
                      {billing(entry).map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Celular: uma lista por entrada, só com o que ela inclui. */}
          <ul className="space-y-4 md:hidden">
            {HOME_ENTRIES.map((entry) => (
              <li key={entry.id} className="rounded-2xl border border-border bg-surface p-5">
                <h3>
                  <EntryHeading entry={entry} />
                </h3>
                <ul className="mt-4 space-y-2.5 border-t border-border pt-4">
                  {rows
                    .filter((row) => row.cells[entry.id] !== null)
                    .map((row) => (
                      <li key={row.feature} className="flex items-center justify-between gap-3 text-sm text-text-secondary">
                        {c.features[row.feature]}
                        <AvailabilityMark value={row.cells[entry.id]} />
                      </li>
                    ))}
                </ul>
                <p className="mt-4 border-t border-border pt-4 text-sm text-text-secondary">
                  <span className="font-medium text-text-primary">{r.billingLabel}: </span>
                  {billing(entry).join(" · ")}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-2xl text-sm leading-relaxed text-text-muted">{r.footnote}</p>
          <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-3">
            <StarBorder href="/build">
              {c.ctas.buildProject}
              <ArrowRight size={15} aria-hidden="true" />
            </StarBorder>
            <Button href="/plans" variant="link" className="text-sm">
              {r.plansLink}
            </Button>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
