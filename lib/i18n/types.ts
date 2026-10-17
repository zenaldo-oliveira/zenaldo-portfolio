export type LanguageCode = "pt" | "en" | "es";

export type Dictionary = {
  nav: {
    home: string;
    about: string;
    services: string;
    projects: string;
    skills: string;
    certificates: string;
    contact: string;
  };
  brand: {
    tagline: string;
    description: string;
  };
  sidebar: {
    navLabel: string;
    moreTitle: string;
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
    themeToLight: string;
    themeToDark: string;
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
      label: string;
      items: string[];
    };
    problems: {
      eyebrow: string;
      title: string;
      items: string[];
      beforeLabel: string;
      afterLabel: string;
      quote: string;
      cta: string;
    };
    solutions: {
      eyebrow: string;
      title: string;
      description: string;
      examplesLabel: string;
      flow: string[];
      items: { title: string; description: string }[];
      viewAll: string;
    };
    product: {
      eyebrow: string;
      title: string;
      tagline: string;
      flowLabel: string;
      flow: string[];
      ctaPrimary: string;
      ctaSecondary: string;
      caption: string;
    };
    cases: {
      eyebrow: string;
      title: string;
      description: string;
      explore: string;
      similar: string;
      viewAll: string;
    };
    howWeWork: {
      eyebrow: string;
      title: string;
      steps: { title: string; description: string }[];
    };
    technologies: {
      eyebrow: string;
      title: string;
      description: string;
      groups: { web: string; mobile: string; backend: string; data: string; ai: string };
    };
    ai: {
      eyebrow: string;
      title: string;
      description: string;
      useCases: string[];
      flow: { input: string; ai: string; action: string };
      proofLabel: string;
      proofText: string;
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
    whatWeDoEyebrow: string;
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
      items: { name: string; area: string }[];
    };
    finalCta: {
      title: string;
      subtitle: string;
    };
  };
  services: {
    eyebrow: string;
    title: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    indexLabel: string;
    labels: { problem: string; application: string; stack: string };
    items: { title: string; description: string }[];
    itemCta: string;
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
  skills: {
    eyebrow: string;
    title: string;
    description: string;
    groups: {
      web: string;
      mobile: string;
      backend: string;
      data: string;
      ai: string;
      automation: string;
    };
    appliedIn: string;
    toolsTitle: string;
  };
  certificates: {
    eyebrow: string;
    title: string;
    description: string;
    formationTitle: string;
    items: {
      title: string;
      institution: string;
      status: string;
    }[];
    plannedTitle: string;
    studyingTitle: string;
    studyingItems: string[];
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
  };
};
