// Fonte única dos projetos reais da ZTech (Home e /projects). Nomes,
// tecnologias e links não são traduzidos (nomes próprios / marcas reais).
// Textos traduzidos (categoria, problema, solução, status) ficam em
// t.projects.items — casados por ÍNDICE com esta lista: manter a mesma ordem.
//
// `demo`/`github` ficam undefined quando não existe URL pública real — o
// botão correspondente simplesmente não é renderizado (nunca um link "#").
//
// `image` fica undefined até existir uma screenshot real de cada projeto —
// nunca preenchido com um placeholder que pareça uma captura de tela real.
// Quando a imagem existir, basta adicionar o caminho aqui; os cards já estão
// prontos para renderizá-la via next/image sem nenhuma outra mudança.
export type Project = {
  title: string;
  technologies: string[];
  demo?: string;
  github?: string;
  featured: boolean;
  image?: string;
};

export const PROJECTS: Project[] = [
  {
    title: "ZLift Manager",
    technologies: [],
    featured: true,
  },
  {
    title: "Dieta IA",
    technologies: [
      "React Native",
      "Expo",
      "TypeScript",
      "Fastify",
      "Gemini AI",
      "Railway",
      "React Query",
      "Zustand",
    ],
    demo: "https://expo.dev/accounts/zenaldo/projects/Dieta-mobile/builds/95262f1b-a2c4-4227-8709-fa5574c90d8d",
    github: "https://github.com/zenaldo-oliveira/dietaapp-mobile",
    featured: true,
  },
  {
    title: "Pet Shop Premium",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    demo: "https://petshop-zenaldo.netlify.app/",
    github: "https://github.com/zenaldo-oliveira/petshop-blad",
    featured: false,
  },
  {
    title: "Barber Shop Premium",
    technologies: ["HTML", "SCSS", "JavaScript", "AOS"],
    demo: "https://barber-premium-site.netlify.app/",
    github: "https://github.com/zenaldo-oliveira/BARBER",
    featured: false,
  },
  {
    title: "Text To Voice AI",
    technologies: ["HTML", "CSS", "JavaScript", "Web Speech API"],
    demo: "https://conversortxt.netlify.app/",
    github: "https://github.com/zenaldo-oliveira/Text-to-Voice",
    featured: false,
  },
  {
    title: "EasyCar Mobile",
    technologies: ["React Native", "JavaScript", "Node.js"],
    github: "https://github.com/zenaldo-oliveira/Frontend-easycar-mobile",
    featured: false,
  },
];

// Tecnologias reais, agrupadas por capacidade — tiradas dos projetos acima,
// da stack declarada em t.services.description e do próprio site (Supabase,
// OpenAI e integração com WhatsApp existem neste código).
export const TECH_GROUPS: { key: "web" | "mobile" | "backend" | "data" | "ai"; items: string[] }[] = [
  { key: "web", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
  { key: "mobile", items: ["React Native", "Expo", "React Query", "Zustand"] },
  { key: "backend", items: ["Node.js", "Fastify", "APIs", "Railway"] },
  { key: "data", items: ["PostgreSQL", "Prisma", "Supabase"] },
  { key: "ai", items: ["Gemini AI", "OpenAI", "Web Speech API", "WhatsApp"] },
];
