"use client";

import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { BarberPackagesGrid } from "@/components/commercial/BarberSolutionsSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { Tabs } from "@/components/ui/Tabs";
import { getServiceOffer, isOfferCustom, LOCAL_SERVICE_COMBOS, SEGMENTS } from "@/lib/catalog/data";
import { useTranslations } from "@/lib/i18n/LanguageContext";

// Serviços locais (climatização e manutenção): combinações recomendadas, cada
// uma abrindo o configurador com o serviço e o segmento já marcados, e o
// ZLift Manager como referência real de sistema para manutenção.
function LocalServicesPanel({ segmentParam }: { segmentParam: string }) {
  const t = useTranslations();
  const c = t.commercial;
  const local = c.home.segments.local;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1.35fr] xl:gap-10">
      <div>
        <h3 className="text-balance text-2xl font-semibold tracking-tight text-text-primary">{local.headline}</h3>
        <p className="mt-3 text-pretty leading-relaxed text-text-secondary">{local.description}</p>

        <aside className="mt-6 rounded-xl border border-border bg-surface/70 p-4">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-accent">
            <ClipboardCheck size={14} aria-hidden="true" />
            {local.referenceLabel}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">{local.reference}</p>
          <Link
            href="/projects"
            className="mt-3 inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-accent transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {local.referenceLink}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </aside>
      </div>

      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-text-muted">{local.combosLabel}</p>
        <ol className="mt-3 space-y-3">
          {LOCAL_SERVICE_COMBOS.map((combo) => {
            const copy = local.combos[combo.id];
            const offer = getServiceOffer(combo.serviceId);
            const isCustom = offer ? isOfferCustom(offer) : false;
            return (
              <li
                key={combo.id}
                className="group flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 transition-colors duration-200 hover:border-border-accent sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-text-primary">{copy.name}</p>
                    <Badge variant={isCustom ? "outline" : "default"}>
                      {isCustom ? c.showcase.customLabel : c.availability.available.label}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-text-secondary">{copy.solves}</p>
                </div>
                <Button
                  href={`/build?service=${combo.serviceId}&segment=${segmentParam}`}
                  variant="secondary"
                  size="sm"
                  className="shrink-0 whitespace-nowrap"
                >
                  {copy.cta}
                  <ArrowRight size={15} aria-hidden="true" />
                </Button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

function BarbershopPanel() {
  const barber = useTranslations().commercial.home.segments.barber;

  return (
    <div>
      <div className="mb-6 max-w-2xl">
        <h3 className="text-balance text-2xl font-semibold tracking-tight text-text-primary">{barber.headline}</h3>
        <p className="mt-2 text-pretty leading-relaxed text-text-secondary">{barber.intro}</p>
      </div>
      <BarberPackagesGrid headingLevel="h4" />
    </div>
  );
}

// Soluções por segmento: serviços locais primeiro (prioridade comercial),
// depois barbearias e salões (os 3 pacotes existentes).
export function SegmentsSection() {
  const t = useTranslations();
  const s = t.commercial.home.segments;

  const items = SEGMENTS.map((segment) => ({
    id: segment.id,
    label: s.tabs[segment.id],
    panel: segment.id === "local-services" ? <LocalServicesPanel segmentParam={segment.param} /> : <BarbershopPanel />,
  }));

  return (
    <Section id="segmentos">
      <Container>
        <SectionHeader eyebrow={s.eyebrow} title={s.title} description={s.description} />
        <Reveal>
          <Tabs label={s.tablistLabel} items={items} />
        </Reveal>
      </Container>
    </Section>
  );
}
