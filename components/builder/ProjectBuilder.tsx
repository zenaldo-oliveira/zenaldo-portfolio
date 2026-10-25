"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ContactStep, NeedsStep, SolutionStep, SummaryStep } from "@/components/builder/BuilderSteps";
import { getPlan, getSolution } from "@/lib/catalog/data";
import { initialBuilderState, selectSolution, validateStep } from "@/lib/catalog/request";
import type { BuilderErrorKey, BuilderState, BuilderStep } from "@/lib/catalog/request";
import { useTranslations } from "@/lib/i18n/LanguageContext";

const STEPS: readonly BuilderStep[] = [0, 1, 2, 3];

// Primeiro campo de cada erro — recebe o foco quando a etapa não valida.
const ERROR_FOCUS: Record<BuilderErrorKey, string> = {
  solution: "builder-solution-sites",
  needs: "builder-details",
  name: "builder-name",
  whatsapp: "builder-whatsapp",
  email: "builder-email",
  company: "builder-company",
};

function allowedAddons(solutionId: BuilderState["solutionId"]): readonly string[] {
  const planId = solutionId ? getSolution(solutionId)?.planId : undefined;
  return planId ? getPlan(planId).addons : [];
}

// "Montar meu projeto": solução → necessidades → contato → resumo e envio
// pelo WhatsApp. Todo o estado fica aqui, então voltar uma etapa preserva o
// que foi preenchido. ?solution=<id> (Soluções/Planos) ou ?package=<id>&
// segment=barbearia (cards de barbearia) já marcam a escolha. Nada é gravado
// em servidor nem cobrado.
export function ProjectBuilder() {
  const t = useTranslations();
  const b = t.commercial.builder;
  const searchParams = useSearchParams();

  const [step, setStep] = useState<BuilderStep>(0);
  const [errors, setErrors] = useState<BuilderErrorKey[]>([]);
  const [state, setState] = useState<BuilderState>(() =>
    initialBuilderState(
      {
        solution: searchParams.get("solution"),
        service: searchParams.get("service"),
        package: searchParams.get("package"),
        segment: searchParams.get("segment"),
      },
      { barber: t.commercial.barber.segmentName, localServices: t.commercial.home.segments.localSegmentName },
    ),
  );

  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasNavigated = useRef(false);

  // Leitores de tela e teclado: a cada troca de etapa o foco vai para o
  // título da etapa (não no carregamento inicial da página).
  useEffect(() => {
    if (hasNavigated.current) headingRef.current?.focus();
  }, [step]);

  function goTo(next: BuilderStep) {
    hasNavigated.current = true;
    setErrors([]);
    setStep(next);
  }

  function handleNext() {
    const stepErrors = validateStep(step, state);
    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      document.getElementById(ERROR_FOCUS[stepErrors[0]])?.focus();
      return;
    }
    if (step < 3) goTo((step + 1) as BuilderStep);
  }

  function update(next: BuilderState) {
    setState(next);
    if (errors.length > 0) setErrors(validateStep(step, next).filter((key) => errors.includes(key)));
  }

  const stepTitles = [b.steps.solution, b.steps.needs, b.steps.contact, b.steps.summary];

  return (
    <div className="rounded-3xl border border-border bg-surface/70">
      {/* Progresso */}
      <nav aria-label={b.eyebrow} className="border-b border-border px-4 py-4 sm:px-8">
        <ol className="grid grid-cols-4 gap-2">
          {STEPS.map((index) => {
            const isCurrent = index === step;
            const isDone = index < step;
            const label = (
              <>
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] ${
                    isCurrent
                      ? "border-accent bg-accent text-background"
                      : isDone
                        ? "border-border-accent text-accent"
                        : "border-border text-text-muted"
                  }`}
                >
                  {index + 1}
                </span>
                <span className={`hidden truncate text-sm sm:inline ${isCurrent ? "font-medium text-text-primary" : "text-text-secondary"}`}>
                  {stepTitles[index]}
                </span>
              </>
            );

            return (
              <li key={index} aria-current={isCurrent ? "step" : undefined}>
                {isDone ? (
                  <button
                    type="button"
                    onClick={() => goTo(index)}
                    className="flex w-full min-w-0 items-center gap-2 rounded-md text-left transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {label}
                    <span className="sr-only">
                      {b.edit}: {stepTitles[index]}
                    </span>
                  </button>
                ) : (
                  <div className="flex min-w-0 items-center gap-2">{label}</div>
                )}
                <div aria-hidden="true" className={`mt-3 h-0.5 rounded-full ${index <= step ? "bg-accent" : "bg-border"}`} />
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="p-4 sm:p-8">
        <p className="font-mono text-[11px] uppercase tracking-wider text-text-muted">
          {b.stepLabel} {step + 1} {b.of} 4
        </p>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          >
            {step === 0 && (
              <SolutionStep
                headingRef={headingRef}
                state={state}
                hasError={errors.includes("solution")}
                onSelect={(solutionId) => update(selectSolution(state, solutionId, allowedAddons(solutionId)))}
              />
            )}
            {step === 1 && (
              <NeedsStep
                headingRef={headingRef}
                state={state}
                addons={allowedAddons(state.solutionId)}
                hasError={errors.includes("needs")}
                onChange={update}
              />
            )}
            {step === 2 && <ContactStep headingRef={headingRef} state={state} errors={errors} onChange={update} />}
            {step === 3 && <SummaryStep headingRef={headingRef} state={state} onEdit={goTo} />}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => goTo((step - 1) as BuilderStep)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-surface px-5 text-sm font-medium text-text-primary transition-colors hover:border-border-strong hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              {b.back}
            </button>
          ) : (
            <span />
          )}
          {step < 3 && (
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-cta px-5 text-sm font-medium text-white transition-colors hover:bg-cta-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {b.next}
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
