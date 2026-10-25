"use client";

import Image from "next/image";
import { Check, Info, Wrench } from "lucide-react";
import { AgendaMockup, PrimeMockup } from "@/components/commercial/BarberMockups";
import { usePriceFormatter } from "@/components/commercial/usePriceFormatter";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { BARBER_PACKAGES, BARBER_SEGMENT } from "@/lib/catalog/data";
import type { BarberPackageDef, BarberPackageId, Pricing } from "@/lib/catalog/data";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import barberShot from "@/public/projects/screenshots/barber-shop-premium.webp";

const LABEL_CLASS = "font-mono text-[11px] uppercase tracking-wider text-text-muted";

// Imagem de cada pacote: captura real só no Presença (site de barbearia já
// entregue); Agenda e Prime usam ilustrações rotuladas como tal.
function PackageMedia({ id, alt }: { id: BarberPackageId; alt: string }) {
  const t = useTranslations();
  const b = t.commercial.barber;
  const isReal = id === "presence";

  return (
    <div className="project-media relative aspect-16/10 w-full overflow-hidden border-b border-border">
      <span className="absolute left-3 top-3 z-10 rounded-full border border-border-strong bg-background/85 px-2.5 py-0.5 text-[11px] font-medium text-text-secondary backdrop-blur">
        {isReal ? b.realProject : b.illustrative}
      </span>
      {isReal ? (
        <div className="absolute inset-x-[8%] top-[16%] overflow-hidden rounded-t-lg border border-b-0 border-border-strong shadow-2xl shadow-black/40 transition-transform duration-500 ease-out group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
          <Image src={barberShot} alt={alt} placeholder="blur" sizes="(min-width: 1280px) 340px, 90vw" className="block h-auto w-full" />
        </div>
      ) : (
        <div
          role="img"
          aria-label={alt}
          className="absolute inset-x-[12%] top-[16%] transition-transform duration-500 ease-out group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
        >
          <div aria-hidden="true">{id === "agenda" ? <AgendaMockup /> : <PrimeMockup />}</div>
        </div>
      )}
    </div>
  );
}

// Implantação e mensalidade só aparecem quando confirmadas no catálogo;
// sem valor confirmado, "Solicitar proposta".
function PackagePrice({ pricing }: { pricing: Pricing }) {
  const t = useTranslations();
  const c = t.commercial;
  const format = usePriceFormatter();
  const hasConfirmed = pricing.setup !== null || pricing.monthly !== null;

  if (!hasConfirmed) {
    return <p className="text-sm font-medium text-text-primary">{c.barber.requestProposal}</p>;
  }

  return (
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
  );
}

function PackageCard({ pack, headingLevel = "h3" }: { pack: BarberPackageDef; headingLevel?: "h3" | "h4" }) {
  const Heading = headingLevel;
  const t = useTranslations();
  const b = t.commercial.barber;
  const copy = b.packages[pack.id];
  const isCustom = pack.resources.some((resource) => !resource.implemented);

  return (
    <article
      aria-labelledby={`barber-${pack.id}-title`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-border-strong motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <PackageMedia id={pack.id} alt={copy.imageAlt} />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-accent">{copy.name}</span>
          {isCustom && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border-strong px-2 py-0.5 text-[11px] font-medium text-text-secondary">
              <Wrench size={11} aria-hidden="true" />
              {b.customLabel}
            </span>
          )}
        </div>
        <Heading id={`barber-${pack.id}-title`} className="mt-2 text-xl font-semibold tracking-tight text-text-primary">
          {copy.title}
        </Heading>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">{copy.benefit}</p>

        <ul className="mt-5 space-y-2 text-sm">
          {pack.resources.map((resource) => (
            <li key={resource.id} className="flex items-start gap-2 text-text-secondary">
              <Check size={15} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
              <span>
                {b.resources[resource.id]}
                {!resource.implemented && (
                  <span className="ml-1.5 whitespace-nowrap rounded border border-border px-1.5 py-px text-[0.625rem] font-medium uppercase tracking-wide text-text-muted">
                    {b.customLabel}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>

        {pack.id === "prime" && (
          <div className="mt-5 rounded-xl border border-border bg-background/40 p-3.5">
            <p className="flex items-center gap-1.5 text-xs font-semibold text-text-primary">
              <Info size={13} aria-hidden="true" className="text-accent" />
              {b.primeHowTitle}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">{b.primeHow}</p>
          </div>
        )}

        <div className="mt-auto space-y-4 pt-6">
          <PackagePrice pricing={pack.pricing} />
          <Button href={`/build?package=${pack.id}&segment=${BARBER_SEGMENT}`} className="w-full">
            {copy.cta}
          </Button>
        </div>
      </div>
    </article>
  );
}

// Os 3 pacotes (Presença, Agenda e Prime) + nota sobre "Sob medida".
// Usado aqui e na aba "Barbearias e salões" da Home.
// headingLevel "h4" quando o grid fica sob um título H3 (aba da Home).
export function BarberPackagesGrid({ headingLevel = "h3" }: { headingLevel?: "h3" | "h4" } = {}) {
  const t = useTranslations();
  const b = t.commercial.barber;

  return (
    <>
      <ul className="grid gap-5 xl:grid-cols-3">
        {BARBER_PACKAGES.map((pack, index) => (
          <li key={pack.id}>
            <Reveal delay={index * 0.08} className="h-full">
              <PackageCard pack={pack} headingLevel={headingLevel} />
            </Reveal>
          </li>
        ))}
      </ul>
      <p className="mt-6 flex gap-2 text-sm text-text-muted">
        <Wrench size={15} aria-hidden="true" className="mt-0.5 shrink-0" />
        {b.customHint}
      </p>
    </>
  );
}
