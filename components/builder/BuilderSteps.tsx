"use client";

import type { ReactNode, RefObject } from "react";
import { Check, Info, MessageCircle, Pencil } from "lucide-react";
import { AvailabilityBadge } from "@/components/commercial/AvailabilityBadge";
import { usePriceFormatter } from "@/components/commercial/usePriceFormatter";
import { buildWhatsAppUrl } from "@/lib/contact/whatsapp";
import { getSolution, SOLUTIONS } from "@/lib/catalog/data";
import type { AddonId, FeatureId, SolutionId } from "@/lib/catalog/data";
import { quoteSelection } from "@/lib/catalog/pricing";
import { buildRequestMessage, MAX_DETAILS_LENGTH, MAX_FIELD_LENGTH, toggleId } from "@/lib/catalog/request";
import type { BuilderContact, BuilderErrorKey, BuilderState, BuilderStep } from "@/lib/catalog/request";
import { useTranslations } from "@/lib/i18n/LanguageContext";

type HeadingRef = RefObject<HTMLHeadingElement | null>;

const LABEL_CLASS = "font-mono text-[11px] uppercase tracking-wider text-text-muted";
const INPUT_CLASS =
  "mt-1.5 w-full rounded-lg border border-border bg-background/60 px-3.5 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent focus-visible:ring-2 focus-visible:ring-ring aria-invalid:border-red-400";

function StepHeading({ headingRef, children, hint }: { headingRef: HeadingRef; children: ReactNode; hint?: string }) {
  return (
    <div className="mt-2">
      <h2 ref={headingRef} tabIndex={-1} className="text-xl font-semibold tracking-tight text-text-primary outline-none sm:text-2xl">
        {children}
      </h2>
      {hint && <p className="mt-1.5 text-sm text-text-secondary">{hint}</p>}
    </div>
  );
}

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="mt-1.5 text-sm text-red-400">
      {message}
    </p>
  );
}

// Checkbox estilizado sobre o input nativo (teclado e leitor de tela nativos).
function CheckOption({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: () => void }) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring ${
        checked ? "border-accent bg-accent/10 text-text-primary" : "border-border bg-background/40 text-text-secondary hover:border-border-strong"
      }`}
    >
      <input id={id} type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden="true"
        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${checked ? "border-accent bg-accent text-background" : "border-border-strong"}`}
      >
        {checked && <Check size={12} strokeWidth={3} />}
      </span>
      {label}
    </label>
  );
}

// 1. Tipo de solução.
export function SolutionStep({
  headingRef,
  state,
  hasError,
  onSelect,
}: {
  headingRef: HeadingRef;
  state: BuilderState;
  hasError: boolean;
  onSelect: (id: SolutionId) => void;
}) {
  const t = useTranslations();
  const c = t.commercial;

  return (
    <fieldset aria-describedby={hasError ? "builder-error-solution" : undefined}>
      <legend className="contents">
        <StepHeading headingRef={headingRef}>{c.builder.solutionQuestion}</StepHeading>
      </legend>
      {hasError && <FieldError id="builder-error-solution" message={c.builder.errors.solution} />}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {SOLUTIONS.map((solution) => {
          const id = `builder-solution-${solution.id}`;
          const checked = state.solutionId === solution.id;
          return (
            <label
              key={solution.id}
              htmlFor={id}
              className={`flex cursor-pointer flex-col gap-2 rounded-xl border p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring ${
                checked ? "border-accent bg-accent/10" : "border-border bg-background/40 hover:border-border-strong"
              }`}
            >
              <input
                id={id}
                type="radio"
                name="builder-solution"
                value={solution.id}
                checked={checked}
                onChange={() => onSelect(solution.id)}
                className="sr-only"
              />
              <span className="flex items-start justify-between gap-3">
                <span className="text-sm font-semibold text-text-primary">{c.solutions[solution.id].name}</span>
                <span
                  aria-hidden="true"
                  className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border ${checked ? "border-[5px] border-accent" : "border-border-strong"}`}
                />
              </span>
              <span className="text-sm leading-relaxed text-text-secondary">{c.solutions[solution.id].summary}</span>
              <AvailabilityBadge availability={solution.availability} />
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

// 2. Necessidades, adicionais e detalhes.
export function NeedsStep({
  headingRef,
  state,
  addons,
  hasError,
  onChange,
}: {
  headingRef: HeadingRef;
  state: BuilderState;
  addons: readonly string[];
  hasError: boolean;
  onChange: (state: BuilderState) => void;
}) {
  const t = useTranslations();
  const c = t.commercial;
  const solution = state.solutionId ? getSolution(state.solutionId) : undefined;

  return (
    <div>
      <StepHeading headingRef={headingRef} hint={c.builder.needsHint}>
        {c.builder.needsQuestion}
      </StepHeading>
      {hasError && <FieldError id="builder-error-needs" message={c.builder.errors.needs} />}

      {solution && (
        <fieldset className="mt-6">
          <legend className={LABEL_CLASS}>{c.solutions[solution.id].name}</legend>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {solution.features.map((id: FeatureId) => (
              <CheckOption
                key={id}
                id={`builder-feature-${id}`}
                label={c.features[id]}
                checked={state.featureIds.includes(id)}
                onChange={() => onChange({ ...state, featureIds: toggleId(state.featureIds, id) })}
              />
            ))}
          </div>
        </fieldset>
      )}

      {addons.length > 0 && (
        <fieldset className="mt-6">
          <legend className={LABEL_CLASS}>{c.builder.addonsQuestion}</legend>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {addons.map((id) => (
              <CheckOption
                key={id}
                id={`builder-addon-${id}`}
                label={c.addons[id as AddonId].name}
                checked={state.addonIds.includes(id)}
                onChange={() => onChange({ ...state, addonIds: toggleId(state.addonIds, id) })}
              />
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-6">
        <label htmlFor="builder-details" className="text-sm font-medium text-text-primary">
          {c.builder.detailsLabel}
        </label>
        <textarea
          id="builder-details"
          rows={4}
          maxLength={MAX_DETAILS_LENGTH}
          value={state.details}
          placeholder={c.builder.detailsPlaceholder}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? "builder-error-needs" : undefined}
          onChange={(event) => onChange({ ...state, details: event.target.value })}
          className={`${INPUT_CLASS} resize-y`}
        />
      </div>
    </div>
  );
}

const CONTACT_FIELDS: { key: keyof BuilderContact; type: string; autoComplete: string; required: boolean; error?: BuilderErrorKey }[] = [
  { key: "name", type: "text", autoComplete: "name", required: true, error: "name" },
  { key: "whatsapp", type: "tel", autoComplete: "tel", required: true, error: "whatsapp" },
  { key: "email", type: "email", autoComplete: "email", required: false, error: "email" },
  { key: "company", type: "text", autoComplete: "organization", required: true, error: "company" },
  { key: "segment", type: "text", autoComplete: "off", required: false },
];

// 3. Contato e empresa.
export function ContactStep({
  headingRef,
  state,
  errors,
  onChange,
}: {
  headingRef: HeadingRef;
  state: BuilderState;
  errors: BuilderErrorKey[];
  onChange: (state: BuilderState) => void;
}) {
  const t = useTranslations();
  const b = t.commercial.builder;

  return (
    <div>
      <StepHeading headingRef={headingRef}>{b.steps.contact}</StepHeading>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {CONTACT_FIELDS.map((field) => {
          const id = `builder-${field.key}`;
          const hasError = field.error ? errors.includes(field.error) : false;
          const errorId = `${id}-error`;
          return (
            <div key={field.key}>
              <label htmlFor={id} className="text-sm font-medium text-text-primary">
                {b.fields[field.key]}
                {!field.required && <span className="font-normal text-text-muted"> ({b.optional})</span>}
              </label>
              <input
                id={id}
                type={field.type}
                autoComplete={field.autoComplete}
                maxLength={MAX_FIELD_LENGTH}
                required={field.required}
                value={state.contact[field.key]}
                aria-invalid={hasError || undefined}
                aria-describedby={hasError ? errorId : undefined}
                onChange={(event) => onChange({ ...state, contact: { ...state.contact, [field.key]: event.target.value } })}
                className={INPUT_CLASS}
              />
              {hasError && field.error && <FieldError id={errorId} message={b.errors[field.error]} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 4. Resumo e envio pelo WhatsApp.
export function SummaryStep({
  headingRef,
  state,
  onEdit,
}: {
  headingRef: HeadingRef;
  state: BuilderState;
  onEdit: (step: BuilderStep) => void;
}) {
  const t = useTranslations();
  const c = t.commercial;
  const b = c.builder;
  const format = usePriceFormatter();

  if (!state.solutionId) return null;
  const quote = quoteSelection({ solutionId: state.solutionId, featureIds: state.featureIds, addonIds: state.addonIds, packageId: state.packageId });
  if (!quote) return null;

  const solution = getSolution(state.solutionId);
  const message = buildRequestMessage({ state, quote, copy: c, format });
  const priced = quote.lines.filter((line) => line.kind !== "feature" || line.pricing.setup !== null || line.pricing.monthly !== null);
  const lineName = (line: (typeof quote.lines)[number]): string => {
    if (line.kind === "package") return `${c.barber.segmentName} · ${c.barber.packages[line.id].name}`;
    if (line.kind === "plan") return c.plans[line.id].name;
    if (line.kind === "addon") return c.addons[line.id].name;
    return c.features[line.id];
  };

  const rows: { label: string; step: BuilderStep; content: ReactNode }[] = [
    ...(state.packageId
      ? [{ label: c.barber.packageLabel, step: 0 as BuilderStep, content: `${c.barber.segmentName} · ${c.barber.packages[state.packageId].name}` }]
      : []),
    ...(state.serviceId ? [{ label: c.showcase.serviceLabel, step: 0 as BuilderStep, content: c.showcase.offers[state.serviceId].name }] : []),
    {
      label: b.summarySolution,
      step: 0,
      content: (
        <span className="flex flex-wrap items-center gap-2">
          {c.solutions[state.solutionId].name}
          {solution && <AvailabilityBadge availability={solution.availability} />}
        </span>
      ),
    },
    {
      label: b.summaryNeeds,
      step: 1,
      content: state.featureIds.length ? state.featureIds.map((id) => c.features[id as FeatureId]).join(" · ") : "—",
    },
    ...(state.addonIds.length
      ? [{ label: b.summaryAddons, step: 1 as BuilderStep, content: state.addonIds.map((id) => c.addons[id as AddonId].name).join(" · ") }]
      : []),
    ...(state.details.trim() ? [{ label: b.summaryDetails, step: 1 as BuilderStep, content: state.details.trim() }] : []),
    {
      label: b.summaryContact,
      step: 2,
      content: [state.contact.name, state.contact.company, state.contact.segment, state.contact.whatsapp, state.contact.email]
        .map((value) => value.trim())
        .filter(Boolean)
        .join(" · "),
    },
  ];

  return (
    <div>
      <StepHeading headingRef={headingRef} hint={b.summaryIntro}>
        {b.steps.summary}
      </StepHeading>

      <dl className="mt-6 divide-y divide-border rounded-xl border border-border">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-start sm:gap-4">
            <dt className={`${LABEL_CLASS} sm:w-36 sm:shrink-0 sm:pt-0.5`}>{row.label}</dt>
            <dd className="min-w-0 flex-1 whitespace-pre-line break-words text-sm text-text-primary">{row.content}</dd>
            <button
              type="button"
              onClick={() => onEdit(row.step)}
              className="inline-flex w-fit items-center gap-1.5 rounded-md text-xs font-medium text-accent transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Pencil size={12} aria-hidden="true" />
              {b.edit}
              <span className="sr-only">: {row.label}</span>
            </button>
          </div>
        ))}
      </dl>

      {/* Estimativa: valor só para itens confirmados; demais "Sob consulta". */}
      <div className="mt-6 rounded-xl border border-border bg-background/40 p-4">
        <p className={LABEL_CLASS}>{b.summaryTotal}</p>
        {quote.requiresScope ? (
          <p className="mt-2 flex gap-2 text-sm text-text-secondary">
            <Info size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
            {b.scopeNote}
          </p>
        ) : (
          <>
            <table className="mt-2 w-full text-left text-sm">
              <thead>
                <tr className="text-text-muted">
                  <th scope="col" className="py-1.5 font-normal">
                    <span className="sr-only">{b.summarySolution}</span>
                  </th>
                  <th scope="col" className="py-1.5 font-normal">{c.setupLabel}</th>
                  <th scope="col" className="py-1.5 font-normal">{c.monthlyLabel}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {priced.map((line) => (
                  <tr key={`${line.kind}-${line.id}`}>
                    <th scope="row" className="py-2 pr-3 font-normal text-text-primary">{lineName(line)}</th>
                    <td className="py-2 pr-3 text-text-secondary">{format(line.pricing.setup)}</td>
                    <td className="py-2 text-text-secondary">{format(line.pricing.monthly)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {quote.totals.setup === null || quote.totals.monthly === null ? (
              <p className="mt-3 text-sm text-text-secondary">{b.totalOnRequest}</p>
            ) : (
              <p className="mt-3 text-sm font-semibold text-text-primary">
                {c.setupLabel}: {format(quote.totals.setup)} · {c.monthlyLabel}: {format(quote.totals.monthly)}
              </p>
            )}
          </>
        )}
      </div>

      <p className="mt-6 text-sm text-text-muted">{b.noPaymentNote}</p>

      <a
        href={buildWhatsAppUrl(message)}
        target="_blank"
        rel="noopener noreferrer"
        aria-describedby="builder-send-hint"
        className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-cta px-5 text-sm font-semibold text-white transition-colors hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
      >
        <MessageCircle size={16} aria-hidden="true" />
        {b.send}
      </a>
      <p id="builder-send-hint" className="mt-2 text-xs text-text-muted">
        {b.sendHint}
      </p>
    </div>
  );
}
