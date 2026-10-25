import type { CommercialCopy } from "@/lib/i18n/commercial-types";

export type LanguageCode = "pt" | "en" | "es";

export type Dictionary = {
  nav: {
    home: string;
    about: string;
    services: string;
    plans: string;
    build: string;
    howItWorks: string;
    projects: string;
    contact: string;
  };
  brand: {
    tagline: string;
    description: string;
  };
  sidebar: {
    navLabel: string;
    // Base da Sidebar: rótulo da navegação institucional e ação de orçamento.
    footerNavLabel: string;
    quoteCta: string;
    collapse: string;
    expand: string;
  };
  topbar: {
    skipToContent: string;
    openMenu: string;
    closeMenu: string;
    breadcrumbLabel: string;
  };
  preferences: {
    trigger: string;
    language: string;
    theme: string;
    themeLight: string;
    themeDark: string;
    display: string;
  };
  footer: {
    navTitle: string;
    moreTitle: string;
    contactTitle: string;
    socialTitle: string;
    whatsapp: string;
    rights: string;
  };
  cta: {
    talk: string;
    whatsappAriaLabel: string;
    // Complemento do nome acessível de CTAs de WhatsApp com rótulo próprio
    // (WCAG 2.5.3: o nome acessível começa pelo texto visível).
    whatsappHint: string;
  };
  globalControls: {
    languageSelector: string;
    languageMenuLabel: string;
  };
  home: {
    hero: {
      eyebrow: string;
      title: string;
      description: string;
      ctaPrimary: string;
      ctaSecondary: string;
      mockup: {
        caption: string;
        modules: string[];
        ordersTitle: string;
        newOrder: string;
        checklistTitle: string;
        checklistItems: string[];
        reportTitle: string;
      };
    };
    capabilities: {
      items: string[];
    };
    solutions: {
      flow: string[];
    };
    product: {
      tagline: string;
      flow: string[];
    };
    cases: {
      eyebrow: string;
      title: string;
      description: string;
      explore: string;
      similar: string;
    };
    // Etapas: t.commercial.howItWorks.steps (fonte única).
    howWeWork: {
      eyebrow: string;
      title: string;
    };
    finalCta: {
      title: string;
      subtitle: string;
      description: string;
      cta: string;
      secondary: string;
    };
  };
  about: {
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
    secondaryCta: string;
    capabilitiesTitle: string;
    proof: {
      eyebrow: string;
      title: string;
      othersLabel: string;
      cta: string;
    };
    founder: {
      eyebrow: string;
      title: string;
      role: string;
      body: string[];
      formationTitle: string;
      formationItems: string[];
    };
    tech: {
      eyebrow: string;
      title: string;
      description: string;
      // Áreas de /about#tecnologias (as tecnologias e os projetos ficam em
      // components/about/AboutTech.tsx).
      groups: Record<"web" | "mobile" | "backend" | "data" | "ai" | "automation", string>;
      appliedIn: string;
    };
    finalCta: {
      title: string;
      subtitle: string;
    };
  };
  projects: {
    badge: string;
    filterLabel: string;
    filterAll: string;
    allTitle: string;
    description: string;
    problemLabel: string;
    solutionLabel: string;
    demoLabel: string;
    githubLabel: string;
    // Textos alternativos das capturas reais ({title} = nome do projeto).
    media: {
      screenshotAlt: string;
      phoneAlts: [string, string];
    };
    carousel: {
      region: string;
      previous: string;
      next: string;
      goTo: string;
      of: string;
    };
    items: {
      category: string;
      problem: string;
      solution: string;
      status: string;
    }[];
  };
  contact: {
    eyebrow: string;
    title: string;
    channelsTitle: string;
    whatsappCta: string;
    responseLabel: string;
    responseValue: string;
    otherChannels: string;
    formTitle: string;
  };
  contactForm: {
    namePlaceholder: string;
    whatsappPlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    submitIdle: string;
    submitSending: string;
    successMessage: string;
    openWhatsapp: string;
    errorMessage: string;
    // Falha ao registrar: alternativa explícita pelo WhatsApp, com os dados
    // já preenchidos (o lead NÃO foi salvo).
    errorWhatsappHint: string;
    sendViaWhatsapp: string;
  };
  commercial: CommercialCopy;
};
