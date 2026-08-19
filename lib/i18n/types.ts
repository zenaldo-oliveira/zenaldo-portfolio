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
  sidebar: {
    tagline: string;
    availableForProjects: string;
    description: string;
  };
  globalControls: {
    themeToLight: string;
    themeToDark: string;
    languageSelector: string;
    languageMenuLabel: string;
  };
  home: {
    hero: {
      badge: string;
      titleLine: string;
      headlineSequence: string[];
      description: string;
      ctaPrimary: string;
      ctaSecondary: string;
    };
    problems: {
      title: string;
      items: string[];
      quote: string;
      cta: string;
    };
    solutions: {
      title: string;
      description: string;
      items: string[];
      viewAll: string;
    };
    cases: {
      title: string;
      description: string;
      items: { category: string; description: string; status: string }[];
      viewAll: string;
    };
    howWeWork: {
      title: string;
      steps: string[];
    };
    ai: {
      title: string;
      description: string;
      useCases: string[];
    };
    technologies: {
      title: string;
    };
    finalCta: {
      title: string;
      description: string;
      cta: string;
    };
  };
  about: {
    badge: string;
    title: string;
    description: string;
    founderTitle: string;
    founderBody: string;
    formationTitle: string;
    formationItems: string[];
    interestsTitle: string;
    interests: string[];
  };
  services: {
    badge: string;
    headlineSequence: string[];
    description: string;
    items: { title: string; description: string }[];
    ctaTitle: string;
    ctaContact: string;
    ctaProjects: string;
  };
  projects: {
    badge: string;
    headlineSequence: string[];
    description: string;
    problemLabel: string;
    solutionLabel: string;
    demoLabel: string;
    githubLabel: string;
    items: {
      category: string;
      problem: string;
      solution: string;
      status: string;
    }[];
  };
  skills: {
    badge: string;
    headlineSequence: string[];
    description: string;
    categories: { title: string }[];
    stats: { value: string; label: string }[];
  };
  certificates: {
    badge: string;
    headlineSequence: string[];
    description: string;
    formationTitle: string;
    formationDescription: string;
    coursesTitle: string;
    items: { title: string; institution: string; status: string }[];
    studyingTitle: string;
    studyingItems: string[];
  };
  contact: {
    badge: string;
    headlineSequence: string[];
    description: string;
    quickLinks: {
      whatsapp: string;
      email: string;
      github: string;
      linkedin: string;
    };
    profileTitle: string;
    profileStack: string;
    tags: { freelance: string; response: string; fullStack: string };
    note: string;
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
    errorMessage: string;
  };
};
