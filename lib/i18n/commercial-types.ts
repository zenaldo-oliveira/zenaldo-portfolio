import type {
  AddonId,
  Availability,
  BarberPackageId,
  BarberResourceId,
  ExternalCostId,
  FeatureId,
  LocalComboId,
  OfferFamilyId,
  PlanId,
  PlansOfferId,
  PlansSiteOfferId,
  SegmentId,
  ServiceOfferId,
  ServiceResourceId,
  SolutionId,
} from "@/lib/catalog/data";

import type { HomeEntryId, HomePreviewId } from "@/lib/catalog/home";

// Textos da área comercial (soluções, planos, montar projeto, como funciona,
// dúvidas). Indexados pelos ids de lib/catalog/data.ts: faltar uma solução,
// plano ou adicional em qualquer idioma é erro de tipo.

type PageHero = {
  eyebrow: string;
  title: string;
  description: string;
};

export type CommercialCopy = {
  priceOnRequest: string;
  setupLabel: string;
  monthlyLabel: string;
  scopeRequired: string;
  availability: Record<Availability, { label: string; description: string }>;
  ctas: {
    viewPlans: string;
    buildProject: string;
    viewPlan: string;
    talkWhatsapp: string;
    howItWorks: string;
  };

  solutions: Record<
    SolutionId,
    {
      name: string;
      summary: string;
      audience: string;
      includes: string[];
      howToHire: string;
    }
  >;
  features: Record<FeatureId, string>;
  plans: Record<PlanId, { name: string }>;
  addons: Record<AddonId, { name: string; description: string }>;
  externalCosts: Record<ExternalCostId, { name: string; description: string }>;

  servicesPage: PageHero & {
    indexLabel: string;
    audienceLabel: string;
    includesLabel: string;
    howToHireLabel: string;
    projectsLabel: string;
    needsEyebrow: string;
    needsTitle: string;
    needsDescription: string;
    detailsEyebrow: string;
    detailsTitle: string;
    // Carrossel de capturas do serviço "sites" (#detalhes).
    viewSite: string;
    showcaseLabel: string;
  };

  // /plans: vitrine de contratação. Os nomes e o público são da página; as
  // entregas dos sistemas vêm de showcase.resources (catálogo).
  plansPage: PageHero & {
    modelTitle: string;
    modelSetup: string;
    modelMonthly: string;
    sitesEyebrow: string;
    sitesTitle: string;
    sitesDescription: string;
    systemsEyebrow: string;
    systemsTitle: string;
    systemsDescription: string;
    audienceLabel: string;
    receivesLabel: string;
    mayIncludeLabel: string;
    limitsLabel: string;
    limitsNote: string;
    supportLabel: string;
    supportValue: string;
    addonsLabel: string;
    customPrice: string;
    offers: Record<PlansOfferId, { name: string; audience: string }>;
    siteDetails: Record<PlansSiteOfferId, { receives: string[]; limits: string[] }>;
    otherTitle: string;
    otherDescription: string;
    otherCta: string;
    addonsTitle: string;
    addonsDescription: string;
    externalTitle: string;
    externalDescription: string;
    paymentNote: string;
  };

  builder: PageHero & {
    stepLabel: string;
    of: string;
    steps: { solution: string; needs: string; contact: string; summary: string };
    solutionQuestion: string;
    needsQuestion: string;
    needsHint: string;
    addonsQuestion: string;
    detailsLabel: string;
    detailsPlaceholder: string;
    fields: {
      name: string;
      whatsapp: string;
      email: string;
      company: string;
      segment: string;
    };
    optional: string;
    errors: {
      solution: string;
      needs: string;
      name: string;
      whatsapp: string;
      email: string;
      company: string;
    };
    back: string;
    next: string;
    summaryIntro: string;
    summarySolution: string;
    summaryNeeds: string;
    summaryAddons: string;
    summaryDetails: string;
    summaryContact: string;
    summaryTotal: string;
    totalOnRequest: string;
    scopeNote: string;
    noPaymentNote: string;
    send: string;
    sendHint: string;
    edit: string;
    message: {
      title: string;
      solution: string;
      needs: string;
      addons: string;
      details: string;
      estimate: string;
      contact: string;
      company: string;
      segment: string;
      email: string;
      whatsapp: string;
      name: string;
    };
  };

  howItWorks: PageHero & {
    steps: { title: string; description: string; client: string }[];
    clientLabel: string;
    ctaTitle: string;
  };

  faq: {
    eyebrow: string;
    title: string;
    items: { question: string; answer: string }[];
  };

  // Seção "Soluções para sua barbearia" (/services#barbearia).
  barber: {
    eyebrow: string;
    title: string;
    description: string;
    segmentName: string;
    packageLabel: string;
    illustrative: string;
    realProject: string;
    customLabel: string;
    customHint: string;
    requestProposal: string;
    primeHowTitle: string;
    primeHow: string;
    resources: Record<BarberResourceId, string>;
    packages: Record<
      BarberPackageId,
      {
        name: string;
        title: string;
        benefit: string;
        cta: string;
        imageAlt: string;
      }
    >;
    mock: {
      service: string;
      professional: string;
      time: string;
      confirm: string;
      subscriberArea: string;
      plan: string;
      usage: string;
      nextVisit: string;
    };
  };

  // Vitrine de serviços (Home): os 6 cards comerciais.
  showcase: {
    eyebrow: string;
    title: string;
    description: string;
    receivesLabel: string;
    requestProposal: string;
    realProject: string;
    illustrative: string;
    customLabel: string;
    serviceLabel: string;
    viewAll: string;
    offers: Record<ServiceOfferId, { name: string; benefit: string; cta: string; imageAlt: string }>;
    resources: Record<ServiceResourceId, string>;
  };

  // Home comercial: demonstração, ofertas, segmentos, processo, contratação.
  home: {
    demoLabel: string;
    demoCaption: string;
    demoPlay: string;
    demoPause: string;
    offers: {
      eyebrow: string;
      title: string;
      description: string;
      // Home: grupo de serviços sob medida, abaixo dos sites em destaque.
      tablistLabel: string;
      families: Record<OfferFamilyId, { name: string; tab: string; benefit: string; need: string }>;
    };
    segments: {
      eyebrow: string;
      title: string;
      description: string;
      tablistLabel: string;
      tabs: Record<SegmentId, string>;
      localSegmentName: string;
      local: {
        headline: string;
        description: string;
        combosLabel: string;
        combos: Record<LocalComboId, { name: string; solves: string; cta: string }>;
        referenceLabel: string;
        reference: string;
        referenceLink: string;
      };
      barber: { headline: string; intro: string };
    };
    // Garantias factuais abaixo dos CTAs do Hero (sem números nem promessas).
    heroNotes: string[];
    // Três entradas comerciais (Home): landing pages, sites e sistemas.
    entries: {
      eyebrow: string;
      title: string;
      description: string;
      resourcesLabel: string;
      items: Record<HomeEntryId, { name: string; benefit: string; cta: string; imageAlt: string }>;
    };
    // Prévias em abas (Home): projetos reais e um protótipo identificado.
    previews: {
      eyebrow: string;
      title: string;
      description: string;
      tablistLabel: string;
      realProject: string;
      prototypeLabel: string;
      prototypeTitle: string;
      prototypeDescription: string;
      viewOnline: string;
      similar: string;
      tabs: Record<HomePreviewId, string>;
    };
    // Tabela do que o cliente recebe, por entrada (fonte: catálogo).
    receives: {
      eyebrow: string;
      title: string;
      description: string;
      tableCaption: string;
      featureLabel: string;
      included: string;
      notIncluded: string;
      billingLabel: string;
      footnote: string;
      plansLink: string;
    };
    // Dois caminhos finais: criar projeto ou pedir análise de um site.
    paths: {
      eyebrow: string;
      title: string;
      create: { title: string; description: string; cta: string };
      existing: { title: string; description: string; note: string; cta: string; message: string; opened: string };
      formLink: string;
    };
    process: { eyebrow: string; title: string; steps: { title: string; description: string }[] };
    contracting: {
      eyebrow: string;
      title: string;
      setup: string;
      monthly: string;
      proposalLine: string;
      cta: string;
    };
    faqAll: string;
    finalCta: { title: string; subtitle: string; whatsapp: string };
  };

};
