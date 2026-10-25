"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { AvailabilityBadge } from "@/components/commercial/AvailabilityBadge";
import { OffersSection } from "@/components/commercial/OffersSection";
import { SolutionVisual } from "@/components/commercial/SolutionVisual";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import { SegmentsSection } from "@/components/services/SegmentsSection";
import {
  getSiteSlides,
  SitesShowcase,
} from "@/components/services/SitesShowcase";
import { AnimatedH1 } from "@/components/ui/AnimatedH1";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section, SectionHeader } from "@/components/ui/Section";
import { SOLUTIONS } from "@/lib/catalog/data";
import { useTranslations } from "@/lib/i18n/LanguageContext";

const LABEL_CLASS =
  "font-mono text-[11px] uppercase tracking-wider text-text-muted";

const siteSlides = getSiteSlides(
  SOLUTIONS.find((solution) => solution.id === "sites")?.projects ?? [],
);

// Catálogo comercial (lib/catalog): para quem serve, o que pode incluir e
// como contratar cada solução. "Disponível" leva ao plano; "Sob medida"
// deixa claro que o valor depende de diagnóstico e escopo.
export function ServicesContent() {
  const t = useTranslations();
  const c = t.commercial;
  const page = c.servicesPage;

  return (
    // services-page: ritmo próprio entre seções desta página (globals.css),
    // sem alterar os tokens globais nem as demais rotas.
    <div className="services-page">
      {/* Hero */}
      <Section variant="hero">
        <Container>
          <div className="max-w-3xl">
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-accent">
              <span
                className="h-1.5 w-1.5 rounded-full bg-accent"
                aria-hidden="true"
              />
              {page.eyebrow}
            </p>
            <AnimatedH1
              className="mt-5 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-text-primary sm:text-5xl"
              text={page.title}
            />
            <p className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-text-secondary sm:text-lg">
              {page.description}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button href="/plans">{c.ctas.viewPlans}</Button>
              <Button href="/build" variant="secondary">
                {c.ctas.buildProject}
              </Button>
            </div>
          </div>

          {/* Legenda dos selos */}
          <dl className="mt-12 grid gap-4 sm:grid-cols-2">
            {(["available", "custom"] as const).map((availability) => (
              <div
                key={availability}
                className="flex flex-col gap-2 rounded-xl border border-border bg-surface/70 p-4"
              >
                <dt>
                  <AvailabilityBadge availability={availability} />
                </dt>
                <dd className="text-sm leading-relaxed text-text-secondary">
                  {c.availability[availability].description}
                </dd>
              </div>
            ))}
          </dl>

          {/* Índice das soluções */}
          <nav
            aria-label={page.indexLabel}
            className="mt-10 border-t border-border pt-6"
          >
            <p className={LABEL_CLASS}>{page.indexLabel}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {SOLUTIONS.map((solution, index) => (
                <li key={solution.id}>
                  <a
                    href={`#${solution.id}`}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="font-mono text-[10px] text-text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {c.solutions[solution.id].name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </Section>

      {/* Ofertas por necessidade do cliente */}
      <OffersSection
        id="por-necessidade"
        byNeed
        showViewAll={false}
        heading={{
          eyebrow: page.needsEyebrow,
          title: page.needsTitle,
          description: page.needsDescription,
        }}
      />

      {/* Segmentos: serviços locais e barbearias (pacotes Presença, Agenda, Prime) */}
      <SegmentsSection />

      {/* Catálogo detalhado */}
      <Section id="detalhes">
        <Container className="space-y-6 lg:space-y-10">
          <SectionHeader
            eyebrow={page.detailsEyebrow}
            title={page.detailsTitle}
          />
          {SOLUTIONS.map((solution, index) => {
            const copy = c.solutions[solution.id];
            const isReversed = index % 2 === 1;

            // Dois cards independentes por serviço: informações + CTAs e a
            // ilustração. No celular o texto vem sempre primeiro; no desktop
            // os lados alternam. Cada card entra uma vez (12px), a ilustração
            // logo depois do texto.
            return (
              <article
                key={solution.id}
                id={solution.id}
                className="grid gap-4 lg:grid-cols-2 lg:gap-6"
              >
                <Reveal
                  distance={12}
                  className={isReversed ? "lg:order-last" : ""}
                >
                  <div className="flex h-full flex-col rounded-3xl border border-border bg-surface/70 p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-xs text-text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <AvailabilityBadge availability={solution.availability} />
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
                      {copy.name}
                    </h2>
                    <p className="mt-3 text-pretty text-base leading-relaxed text-text-secondary lg:mt-4">
                      {copy.summary}
                    </p>

                    <dl className="mt-7 space-y-5 border-t border-border pt-6 text-sm lg:mt-8">
                      <div>
                        <dt className={LABEL_CLASS}>{page.audienceLabel}</dt>
                        <dd className="mt-1.5 leading-relaxed text-text-secondary">
                          {copy.audience}
                        </dd>
                      </div>
                      <div>
                        <dt className={LABEL_CLASS}>{page.includesLabel}</dt>
                        <dd className="mt-2">
                          <ul className="space-y-1.5">
                            {copy.includes.map((item) => (
                              <li
                                key={item}
                                className="flex gap-2 text-text-secondary"
                              >
                                <Check
                                  size={15}
                                  aria-hidden="true"
                                  className="mt-0.5 shrink-0 text-accent"
                                />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                      <div>
                        <dt className={LABEL_CLASS}>{page.howToHireLabel}</dt>
                        <dd className="mt-1.5 leading-relaxed text-text-secondary">
                          {copy.howToHire}
                          {solution.availability === "custom" && (
                            <span className="mt-1.5 block font-medium text-text-primary">
                              {c.scopeRequired}
                            </span>
                          )}
                        </dd>
                      </div>
                      {solution.projects.length > 0 && (
                        <div>
                          <dt className={LABEL_CLASS}>{page.projectsLabel}</dt>
                          <dd className="mt-2 flex flex-wrap gap-1.5">
                            {solution.projects.map((name) => (
                              <Link
                                key={name}
                                href="/projects"
                                className="rounded-md border border-border-accent bg-accent/10 px-2 py-0.5 text-xs text-text-primary transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              >
                                {name}
                              </Link>
                            ))}
                          </dd>
                        </div>
                      )}
                    </dl>

                    <div className="mt-auto flex flex-wrap gap-2 pt-8">
                      {solution.planId && (
                        <Button
                          href={`/plans#plan-${solution.planId}`}
                          size="sm"
                        >
                          {c.ctas.viewPlan}
                        </Button>
                      )}
                      <Button
                        href={`/build?solution=${solution.id}`}
                        variant={solution.planId ? "secondary" : "primary"}
                        size="sm"
                      >
                        {c.ctas.buildProject}
                      </Button>
                      <WhatsAppCta
                        label={c.ctas.talkWhatsapp}
                        ariaLabel={`${c.ctas.talkWhatsapp} ${t.cta.whatsappHint}`}
                        variant="secondary"
                        size="sm"
                        showArrow={false}
                      />
                    </div>
                  </div>
                </Reveal>

                <Reveal distance={12} delay={0.08}>
                  {solution.id === "sites" && siteSlides.length > 0 ? (
                    // Sites: capturas reais dos projetos publicados (carrossel manual).
                    <div className="group/visual flex h-full items-center justify-center overflow-hidden rounded-3xl border border-border bg-background/40 p-6 sm:p-8">
                      <SitesShowcase slides={siteSlides} />
                    </div>
                  ) : solution.id === "catalog" ? (
                    /* Catálogos digitais: imagem do projeto */
                    /* Catálogos digitais: imagem preenchendo o card */
                    <figure className="relative m-0 min-h-[280px] overflow-hidden rounded-3xl border border-border bg-background/40 lg:h-full">
                      <Image
                        src="/projects/screenshots/cardapio.webp"
                        alt="Captura de tela do cardápio digital"
                        fill
                        sizes="(max-width: 1023px) 100vw, 50vw"
                        className="object-contain"
                      />
                    </figure>
                  ) : solution.id === "crm" ? (
                    /* CRM: imagem ilustrativa */
                    /* CRM: imagem ocupando todo o card */
                    /* CRM: imagem inteira, sem cortes */
                    <figure className="m-0 flex h-full min-w-0 flex-col justify-center overflow-hidden rounded-3xl border border-border bg-background/40">
                      <div className="relative aspect-[16/10] w-full">
                        <Image
                          src="/projects/screenshots/crm-ilustrativo.webp"
                          alt="Ilustração de um painel de gestão de clientes e vendas"
                          fill
                          sizes="(max-width: 1023px) 100vw, 50vw"
                          className="object-contain"
                        />
                      </div>

                      <figcaption className="px-4 py-3 text-center text-xs text-text-muted">
                        Imagem ilustrativa de CRM — solução sob medida
                      </figcaption>
                    </figure>
                  ) : (
                    <div
                      aria-hidden="true"
                      className="group/visual flex h-full items-center justify-center overflow-hidden rounded-3xl border border-border bg-background/40 p-8 sm:p-12"
                    >
                      {/* zoom (CSS): amplia o preview (desenhado em escala de card) sem refazer o
                          layout interno. Hover: aproximação de 3% recortada pela moldura, só
                          com mouse (hover + ponteiro preciso) e sem movimento reduzido. */}
                      <div
                        data-zoom=""
                        className="w-full max-w-md lg:[zoom:1.2] motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:[@media(hover:hover)_and_(pointer:fine)]:group-hover/visual:scale-[1.03]"
                      >
                        <SolutionVisual visual={solution.visual} />
                      </div>
                    </div>
                  )}
                </Reveal>
              </article>
            );
          })}

          <Link
            href="/plans"
            className="inline-flex items-center gap-2 rounded-md pt-4 text-sm font-medium text-accent transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {c.ctas.viewPlans}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </Container>
      </Section>

      <FinalCtaSection />
    </div>
  );
}
