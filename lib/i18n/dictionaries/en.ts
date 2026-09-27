import type { Dictionary } from "@/lib/i18n/types";

export const en: Dictionary = {
  nav: {
    home: "Home",
    about: "About",
    services: "Solutions",
    projects: "Cases",
    skills: "Skills",
    certificates: "Certificates",
    contact: "Contact",
  },
  brand: {
    tagline: "Technology that drives business",
    description:
      "Professional websites, web systems, smart automations and AI agents for businesses.",
  },
  sidebar: {
    navLabel: "Main navigation",
    moreTitle: "More",
    collapse: "Collapse sidebar",
    expand: "Expand sidebar",
  },
  topbar: {
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    breadcrumbLabel: "Breadcrumb",
  },
  preferences: {
    trigger: "Preferences",
    language: "Language",
    theme: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    display: "Display",
  },
  footer: {
    navTitle: "Navigation",
    moreTitle: "More",
    contactTitle: "Contact",
    socialTitle: "Social",
    whatsapp: "WhatsApp",
    rights: "All rights reserved.",
  },
  cta: {
    talk: "Talk to ZTech",
    whatsappAriaLabel: "Talk to ZTech on WhatsApp (opens in a new tab)",
  },
  globalControls: {
    themeToLight: "Switch to light theme",
    themeToDark: "Switch to dark theme",
    languageSelector: "Select language",
    languageMenuLabel: "Available languages",
  },
  home: {
    hero: {
      eyebrow: "ZTech Solutions",
      title: "Software that turns processes into digital products.",
      description:
        "We build web systems, apps, SaaS platforms, AI-powered solutions and tailor-made automations for businesses that want more productivity, control and scale.",
      ctaPrimary: "Talk to ZTech",
      ctaSecondary: "Explore projects",
      mockup: {
        caption: "Concept interface · ZLift Manager",
        modules: [
          "Clients",
          "Elevators",
          "Technicians",
          "Service orders",
          "Checklist",
          "Reports",
        ],
        ordersTitle: "Service orders",
        newOrder: "New order",
        checklistTitle: "Execution checklist",
        checklistItems: ["Photos", "Notes", "Signature", "Report"],
        reportTitle: "Report",
      },
    },
    capabilities: {
      label: "What we build",
      items: [
        "Web Systems",
        "SaaS",
        "Apps",
        "Artificial Intelligence",
        "Automation",
        "Integrations",
      ],
    },
    problems: {
      eyebrow: "The problem",
      title: "Does your business still rely on manual processes?",
      items: [
        "Scattered spreadsheets",
        "Manual processes",
        "Decentralized information",
        "Too many repetitive tasks",
        "Systems that don't talk to each other",
        "Hard to track operations",
        "Lack of metrics",
        "Manual customer service",
      ],
      beforeLabel: "Today",
      afterLabel: "With tailor-made software",
      quote: "Technology should simplify operations, not complicate them.",
      cta: "I want to improve my process",
    },
    solutions: {
      eyebrow: "Solutions",
      title: "We build digital solutions for different challenges.",
      description:
        "Enterprise systems, SaaS, artificial intelligence, automation, web systems and integrations.",
      examplesLabel: "Real case",
      flow: ["Input", "AI", "Automation", "Result"],
      items: [
        {
          title: "Custom systems",
          description:
            "Tailor-made systems for management, operations, clients and processes — instead of loose spreadsheets and manual control.",
        },
        {
          title: "Apps",
          description:
            "Mobile apps built with React Native and Expo, connected to their own backend.",
        },
        {
          title: "SaaS",
          description:
            "We turn a solution into a product: a scalable platform, ready to serve multiple clients.",
        },
        {
          title: "AI & automation",
          description:
            "AI applied to customer service, lead qualification and support, plus repetitive processes automated across systems, WhatsApp and everyday tools.",
        },
      ],
      viewAll: "View all solutions",
    },
    product: {
      eyebrow: "Own product",
      title: "A proprietary product in operation",
      tagline: "A platform for managing maintenance operations.",
      flowLabel: "Centralized operational flow",
      flow: [
        "Clients",
        "Elevators",
        "Technicians",
        "Service orders",
        "Execution",
        "Checklist",
        "Photos",
        "Notes",
        "Signature",
        "Report",
      ],
      ctaPrimary: "Explore the project",
      ctaSecondary: "Talk to ZTech",
      caption: "Concept representation of the platform modules.",
    },
    cases: {
      eyebrow: "Cases",
      title: "Projects we've built",
      description:
        "Real examples of what we've already built — the problem, the solution and the technology behind each one.",
      explore: "Explore",
      similar: "I want something similar",
      viewAll: "View all cases",
    },
    howWeWork: {
      eyebrow: "How we work",
      title: "From problem to software",
      steps: [
        { title: "Understand", description: "We understand the problem and map the process." },
        { title: "Design", description: "We define the solution." },
        { title: "Build", description: "We develop, test and ship to production." },
        { title: "Evolve", description: "We evolve the solution." },
      ],
    },
    technologies: {
      eyebrow: "Technology",
      title: "Built with modern technology",
      description: "The stack used across ZTech projects, organized by capability.",
      groups: {
        web: "Web",
        mobile: "Mobile",
        backend: "Backend",
        data: "Data",
        ai: "AI / Automation",
      },
    },
    ai: {
      eyebrow: "AI & automation",
      title: "Artificial intelligence applied to business.",
      description:
        "We use AI for customer service, lead qualification, automation, analytics, support and productivity — cutting repetitive manual work out of the operation.",
      useCases: [
        "Customer service",
        "Lead qualification",
        "Automation",
        "Analytics",
        "Support",
        "Productivity",
      ],
      flow: {
        input: "Message or data",
        ai: "Artificial intelligence",
        action: "Action in the system or WhatsApp",
      },
      proofLabel: "Real case",
      proofText: "Dieta IA: an app that generates personalized diets with Gemini AI.",
    },
    finalCta: {
      title: "Got a process that could be better?",
      subtitle: "Let's turn your idea into software.",
      description:
        "Tell us how your company works today. We'll understand the problem and assess how technology can transform that process.",
      cta: "Talk to ZTech",
      secondary: "Prefer a form? Send a message",
    },
  },
  about: {
    eyebrow: "About ZTech Solutions",
    title: "Technology that turns real problems into digital solutions.",
    description:
      "ZTech Solutions builds web systems, SaaS, apps, automations and artificial intelligence solutions for businesses that want to digitize processes and gain more control over their operations.",
    cta: "Talk to ZTech",
    secondaryCta: "Explore cases",
    capabilitiesTitle: "What we build",
    whatWeDoEyebrow: "What we do",
    proof: {
      eyebrow: "Proof",
      title: "What we've already built",
      othersLabel: "Other projects",
      cta: "Explore cases",
    },
    founder: {
      eyebrow: "Founder",
      title: "Who's behind ZTech",
      role: "Founder of ZTech Solutions",
      body: [
        "ZTech Solutions was founded by Zenaldo Oliveira, a full stack developer with a degree in Systems Analysis and Development, building modern applications with React, Next.js, TypeScript, Prisma and PostgreSQL.",
        "Beyond development, he has a technical background in Electrotechnics and knowledge of Digital Investigation (OSINT) — a combination that strengthens the problem-solving and analytical thinking behind every solution delivered.",
      ],
      formationTitle: "Education",
      formationItems: [
        "Systems Analysis and Development",
        "Technical background in Electrotechnics",
        "React and Next.js",
      ],
    },
    tech: {
      eyebrow: "Technical capability",
      title: "The technology we build with.",
      description:
        "Development of enterprise systems, SaaS, automations and artificial intelligence solutions, using React, Next.js, TypeScript, Prisma and PostgreSQL.",
      items: [
        { name: "React", area: "Interfaces" },
        { name: "Next.js", area: "Web applications" },
        { name: "TypeScript", area: "Language" },
        { name: "Node.js", area: "Backend" },
        { name: "Prisma", area: "ORM" },
        { name: "PostgreSQL", area: "Database" },
        { name: "AI", area: "Gemini AI · OpenAI" },
        { name: "Automation", area: "WhatsApp · integrations" },
      ],
    },
    finalCta: {
      title: "Got a process that could be better?",
      subtitle: "Tell ZTech what your business needs.",
    },
  },
  services: {
    eyebrow: "Solutions",
    title: "We build digital solutions for different challenges.",
    description:
      "Development of enterprise systems, SaaS, automations and artificial intelligence solutions, using React, Next.js, TypeScript, Prisma and PostgreSQL.",
    ctaPrimary: "Talk to ZTech",
    ctaSecondary: "View projects",
    indexLabel: "On this page",
    labels: { problem: "Solves", application: "Real application", stack: "Stack" },
    items: [
      {
        title: "Enterprise Systems",
        description:
          "Tailor-made systems for management, operations, clients and processes — instead of loose spreadsheets and manual control.",
      },
      {
        title: "SaaS",
        description:
          "We turn a solution into a product: a scalable platform, ready to serve multiple clients.",
      },
      {
        title: "Artificial Intelligence",
        description:
          "AI applied to customer service, lead qualification and support, cutting repetitive manual work.",
      },
      {
        title: "Automation",
        description:
          "Repetitive processes automated across systems, WhatsApp and the company's everyday tools.",
      },
      {
        title: "Web Systems",
        description:
          "Modern, responsive applications, built according to the real needs of the business.",
      },
      {
        title: "Integrations",
        description:
          "We connect APIs, databases and services to eliminate rework between systems that don't talk to each other.",
      },
    ],
    itemCta: "Talk about this solution",
  },
  projects: {
    badge: "Cases and Projects",
    filterLabel: "Filter by category",
    filterAll: "All",
    allTitle: "All projects",
    description:
      "Each case below shows the real problem and the solution delivered — built with React, Next.js, React Native, Artificial Intelligence and scalable solutions for businesses.",
    problemLabel: "Problem",
    solutionLabel: "Solution",
    demoLabel: "Demo",
    githubLabel: "GitHub",
    carousel: {
      region: "Projects",
      previous: "Previous project",
      next: "Next project",
      goTo: "Go to project",
      of: "of",
    },
    items: [
      {
        category: "Platform / SaaS",
        problem:
          "Elevator maintenance companies often run on manual processes and information scattered across clients, equipment, technicians and service orders.",
        solution:
          "A proprietary platform that centralizes the entire operational flow: clients, elevators, technicians, service orders, execution, checklist, photos, notes, signature and report.",
        status: "Own product",
      },
      {
        category: "Mobile App",
        problem:
          "Building a personalized diet usually depends on manual tracking, without automatically cross-referencing all of the user's data.",
        solution:
          "A Full Stack mobile app with Artificial Intelligence (Gemini AI) that generates personalized diets from weight, height, age, goal and activity level.",
        status: "Flagship Project",
      },
      {
        category: "Business Website",
        problem:
          "Local pet shops without a professional digital presence lose customers to competitors with a website and a direct contact channel.",
        solution:
          "A professional website with modern, responsive design and direct WhatsApp integration for lead capture.",
        status: "Online",
      },
      {
        category: "Business Website",
        problem:
          "Barbershops that rely only on referrals or social media struggle to convert interest into bookings.",
        solution:
          "A professional website with responsive design, WhatsApp integration and a focus on generating bookings.",
        status: "Online",
      },
      {
        category: "Web Tool",
        problem:
          "Text content isn't always accessible to every user or every context of use.",
        solution:
          "A web app that converts text to audio using speech synthesis via the Web Speech API, with no paid third-party services.",
        status: "Online",
      },
      {
        category: "Mobile App",
        problem:
          "Vehicle fleet management (vehicles, clients, services) without a dedicated system tends to end up scattered across spreadsheets and notes.",
        solution:
          "A mobile app integrated with a proprietary backend to centralize fleet management.",
        status: "In Development",
      },
    ],
  },
  skills: {
    eyebrow: "Technology",
    title: "Technical capabilities",
    description:
      "Full Stack development, Artificial Intelligence and automations to build modern, scalable, results-focused solutions.",
    groups: {
      web: "Web",
      mobile: "Mobile",
      backend: "Backend",
      data: "Data",
      ai: "Artificial intelligence",
      automation: "Automation",
    },
    appliedIn: "Applied in",
    toolsTitle: "Everyday tools",
  },
  certificates: {
    eyebrow: "Education",
    title: "Education and certifications",
    description:
      "Academic background, specialization and ongoing studies of the person behind ZTech Solutions.",
    formationTitle: "Academic background",
    items: [
      {
        title: "Systems Analysis and Development",
        institution: "Degree",
        status: "Completed",
      },
      {
        title: "Full Stack Program",
        institution: "Specialization",
        status: "In progress",
      },
      { title: "React", institution: "Certification", status: "Coming soon" },
      {
        title: "Next.js",
        institution: "Certification",
        status: "Coming soon",
      },
      {
        title: "TypeScript",
        institution: "Certification",
        status: "Coming soon",
      },
      {
        title: "AI & Automation",
        institution: "Certification",
        status: "Coming soon",
      },
    ],
    plannedTitle: "Planned certifications",
    studyingTitle: "Currently studying",
    studyingItems: [
      "React Native",
      "Next.js",
      "Prisma",
      "PostgreSQL",
      "AI",
      "AI Agents",
      "WhatsApp Automation",
      "OSINT",
      "Docker",
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's talk about your project.",
    channelsTitle: "Talk directly to ZTech",
    whatsappCta: "Talk to ZTech",
    responseLabel: "Response time",
    responseValue: "Within 24h",
    otherChannels: "Other channels",
    formTitle: "Send a message",
  },
  contactForm: {
    namePlaceholder: "Your name",
    whatsappPlaceholder: "Your WhatsApp (with area code)",
    emailPlaceholder: "Your email",
    messagePlaceholder: "Describe your project...",
    submitIdle: "Send via WhatsApp",
    submitSending: "Sending...",
    successMessage:
      "Contact registered! If WhatsApp doesn't open automatically, tap the button below.",
    openWhatsapp: "Open WhatsApp chat",
    errorMessage:
      "We couldn't register your contact right now. Please try again shortly.",
  },
};
