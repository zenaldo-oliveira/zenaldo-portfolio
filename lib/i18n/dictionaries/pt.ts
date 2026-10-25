import { commercialPt } from "@/lib/i18n/dictionaries/commercial/pt";
import type { Dictionary } from "@/lib/i18n/types";

export const pt: Dictionary = {
  nav: {
    home: "Início",
    about: "Sobre a ZTech",
    services: "Sites e sistemas",
    plans: "Planos e valores",
    build: "Montar projeto",
    howItWorks: "Como funciona",
    projects: "Projetos reais",
    contact: "Contato",
  },
  brand: {
    tagline: "Tecnologia que impulsiona negócios",
    description:
      "Sites profissionais, sistemas web, automações inteligentes e agentes de IA para empresas.",
  },
  sidebar: {
    navLabel: "Navegação principal",
    footerNavLabel: "Institucional",
    quoteCta: "Pedir orçamento",
    collapse: "Recolher barra lateral",
    expand: "Expandir barra lateral",
  },
  topbar: {
    skipToContent: "Pular para o conteúdo",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    breadcrumbLabel: "Localização",
  },
  preferences: {
    trigger: "Preferências",
    language: "Idioma",
    theme: "Tema",
    themeLight: "Claro",
    themeDark: "Escuro",
    display: "Exibição",
  },
  footer: {
    navTitle: "Navegação",
    moreTitle: "Mais",
    contactTitle: "Contato",
    socialTitle: "Redes",
    whatsapp: "WhatsApp",
    rights: "Todos os direitos reservados.",
  },
  cta: {
    talk: "Falar com a ZTech",
    whatsappAriaLabel: "Falar com a ZTech pelo WhatsApp (abre em nova aba)",
    whatsappHint: "pelo WhatsApp (abre em nova aba)",
  },
  globalControls: {
    languageSelector: "Selecionar idioma",
    languageMenuLabel: "Idiomas disponíveis",
  },
  home: {
    hero: {
      eyebrow: "Tecnologia para pequenas e médias empresas",

      title:
        "Sites para apresentar sua empresa. Sistemas para facilitar sua operação.",

      description:
        "Desenvolvemos sites, sistemas e automações para o seu negócio. Antes de contratar, você recebe uma proposta com escopo, prazo e valores definidos.",

      ctaPrimary: "Solicitar proposta",
      ctaSecondary: "Ver projetos reais",

      mockup: {
        caption: "Interface conceitual · ZLift Manager",
        modules: [
          "Clientes",
          "Elevadores",
          "Técnicos",
          "Ordens de serviço",
          "Checklist",
          "Relatórios",
        ],
        ordersTitle: "Ordens de serviço",
        newOrder: "Nova ordem",
        checklistTitle: "Checklist de execução",
        checklistItems: ["Fotos", "Observações", "Assinatura", "Relatório"],
        reportTitle: "Relatório",
      },
    },

    // Mantenha as outras propriedades de home aqui.
    capabilities: {
      items: [
        "Sistemas Web",
        "SaaS",
        "Aplicativos",
        "Inteligência Artificial",
        "Automação",
        "Integrações",
      ],
    },
    solutions: {
      flow: ["Entrada", "IA", "Automação", "Resultado"],
    },
    product: {
      tagline: "Plataforma para gestão de operações de manutenção.",
      flow: [
        "Clientes",
        "Elevadores",
        "Técnicos",
        "Ordens de serviço",
        "Execução",
        "Checklist",
        "Fotos",
        "Observações",
        "Assinatura",
        "Relatório",
      ],
    },
    cases: {
      eyebrow: "Projetos reais",
      title: "Projetos que construímos",
      description:
        "Exemplos reais do que já desenvolvemos — o problema, a solução e a tecnologia por trás de cada um.",
      explore: "Explorar",
      similar: "Quero algo parecido",
    },
    howWeWork: {
      eyebrow: "Como trabalhamos",
      title: "Do problema ao software",
    },
    finalCta: {
      title: "Tem um processo que pode ser melhor?",
      subtitle: "Vamos transformar sua ideia em software.",
      description:
        "Conte como sua empresa trabalha hoje. Vamos entender o problema e avaliar como a tecnologia pode transformar esse processo.",
      cta: "Falar com a ZTech",
      secondary: "Prefere formulário? Enviar mensagem",
    },
  },
  about: {
    eyebrow: "Sobre a ZTech Solutions",
    title: "Tecnologia para transformar problemas reais em soluções digitais.",
    description:
      "A ZTech Solutions desenvolve sistemas web, SaaS, aplicativos, automações e soluções com inteligência artificial para empresas que querem digitalizar processos e ganhar mais controle sobre suas operações.",
    cta: "Falar com a ZTech",
    secondaryCta: "Explorar cases",
    capabilitiesTitle: "O que desenvolvemos",
    proof: {
      eyebrow: "Prova",
      title: "O que já construímos",
      othersLabel: "Outros projetos",
      cta: "Explorar cases",
    },
    founder: {
      eyebrow: "Fundador",
      title: "Quem está por trás da ZTech",
      role: "Fundador da ZTech Solutions",
      body: [
        "A ZTech Solutions é fundada por Zenaldo Oliveira, desenvolvedor full stack formado em Análise e Desenvolvimento de Sistemas, que constrói aplicações modernas com React, Next.js, TypeScript, Prisma e PostgreSQL.",
        "Além do desenvolvimento, possui formação técnica em Eletrotécnica e conhecimentos em Investigação Digital (OSINT) — uma combinação que fortalece a resolução de problemas e o pensamento analítico por trás de cada solução entregue.",
      ],
      formationTitle: "Formação",
      formationItems: [
        "Análise e Desenvolvimento de Sistemas",
        "Formação técnica em Eletrotécnica",
        "React e Next.js",
      ],
    },
    tech: {
      eyebrow: "Capacidade técnica",
      title: "As tecnologias com que construímos.",
      description:
        "As tecnologias que usamos nas entregas, com os projetos reais em que cada uma já foi aplicada.",
      groups: {
        web: "Web",
        mobile: "Mobile",
        backend: "Backend",
        data: "Dados",
        ai: "Inteligência artificial",
        automation: "Automação",
      },
      appliedIn: "Aplicado em",
    },
    finalCta: {
      title: "Tem um processo que pode ser melhor?",
      subtitle: "Conte para a ZTech o que sua empresa precisa.",
    },
  },
  projects: {
    badge: "Cases e Projetos",
    filterLabel: "Filtrar por categoria",
    filterAll: "Todos",
    allTitle: "Todos os projetos",
    description:
      "Cada case abaixo mostra o problema real e a solução entregue — desenvolvidos com React, Next.js, React Native, Inteligência Artificial e soluções escaláveis para empresas.",
    problemLabel: "Problema",
    solutionLabel: "Solução",
    demoLabel: "Demo",
    githubLabel: "GitHub",
    media: {
      screenshotAlt: "Página inicial publicada do {title}",
      phoneAlts: [
        "Tela inicial do aplicativo {title}",
        "Dieta gerada pelo aplicativo {title}",
      ],
    },
    carousel: {
      region: "Projetos",
      previous: "Projeto anterior",
      next: "Próximo projeto",
      goTo: "Ir para o projeto",
      of: "de",
    },
    items: [
      {
        category: "Plataforma / SaaS",
        problem:
          "Empresas de manutenção de elevadores costumam operar com processos manuais e informações dispersas entre clientes, equipamentos, técnicos e ordens de serviço.",
        solution:
          "Plataforma própria que centraliza todo o fluxo operacional: clientes, elevadores, técnicos, ordens de serviço, execução, checklist, fotos, observações, assinatura e relatório.",
        status: "Produto próprio",
      },
      {
        category: "Aplicativo Mobile",
        problem:
          "Montar uma dieta personalizada normalmente depende de acompanhamento manual, sem cruzar automaticamente todos os dados do usuário.",
        solution:
          "Aplicativo mobile Full Stack com Inteligência Artificial (Gemini AI) que gera dietas personalizadas a partir de peso, altura, idade, objetivo e nível de atividade física.",
        status: "Projeto Principal",
      },
      {
        category: "Site Institucional",
        problem:
          "Pet shops locais sem presença digital profissional perdem clientes para concorrentes com site e canal de contato direto.",
        solution:
          "Website profissional com design moderno, responsivo e integração direta com WhatsApp para captação de clientes.",
        status: "Online",
      },
      {
        category: "Site Institucional",
        problem:
          "Barbearias que dependem só de indicação ou redes sociais têm dificuldade para converter interesse em agendamento.",
        solution:
          "Site profissional com design responsivo, integração com WhatsApp e foco em geração de agendamentos.",
        status: "Online",
      },
      {
        category: "Ferramenta Web",
        problem:
          "Conteúdo em texto nem sempre é acessível para todos os usuários ou contextos de uso.",
        solution:
          "Aplicação web que converte texto em áudio usando síntese de voz via Web Speech API, sem depender de serviços pagos de terceiros.",
        status: "Online",
      },
      {
        category: "Aplicativo Mobile",
        problem:
          "Gestão automotiva (veículos, clientes, serviços) sem um sistema dedicado costuma ficar espalhada entre planilhas e anotações.",
        solution:
          "Aplicativo mobile integrado a um backend próprio para centralizar a gestão automotiva.",
        status: "Em Desenvolvimento",
      },

      {
        category: "Site",
        problem: "Apresentação digital de uma cafeteria.",
        solution: "Confira a captura do projeto Cafeteria.",
        status: "Projeto",
      },
      {
        category: "Site",
        problem: "Apresentação digital de um negócio de turismo.",
        solution: "Confira a captura do projeto Turismo.",
        status: "Projeto",
      },
    ],
  },
  contact: {
    eyebrow: "Contato",
    title: "Vamos conversar sobre seu projeto.",
    channelsTitle: "Fale direto com a ZTech",
    whatsappCta: "Falar com a ZTech",
    responseLabel: "Tempo de resposta",
    responseValue: "Até 24h",
    otherChannels: "Outros canais",
    formTitle: "Enviar mensagem",
  },
  contactForm: {
    namePlaceholder: "Seu nome",
    whatsappPlaceholder: "Seu WhatsApp (com DDD)",
    emailPlaceholder: "Seu e-mail",
    messagePlaceholder: "Descreva seu projeto...",
    submitIdle: "Enviar para WhatsApp",
    submitSending: "Enviando...",
    successMessage:
      "Contato registrado! Se o WhatsApp não abrir automaticamente, toque no botão abaixo.",
    openWhatsapp: "Abrir conversa no WhatsApp",
    errorMessage:
      "Não foi possível registrar seu contato agora. Tente novamente em instantes.",
    errorWhatsappHint:
      "Seus dados continuam no formulário. Se preferir, envie a mesma mensagem direto pelo WhatsApp:",
    sendViaWhatsapp: "Enviar pelo WhatsApp",
  },
  commercial: commercialPt,
};
