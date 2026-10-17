import type { StaticImageData } from "next/image";
import barberShot from "@/public/projects/screenshots/barber-shop-premium.webp";
import dietaHome from "@/public/projects/screenshots/dieta-ia-inicio.webp";
import dietaResult from "@/public/projects/screenshots/dieta-ia-resultado.webp";
import petShopShot from "@/public/projects/screenshots/pet-shop-premium.webp";
import textToVoiceShot from "@/public/projects/screenshots/text-to-voice-ai.webp";

// Fonte única dos projetos reais da ZTech (Home e /projects). Nomes,
// tecnologias e links não são traduzidos (nomes próprios / marcas reais).
// Textos traduzidos (categoria, problema, solução, status) ficam em
// t.projects.items — casados por ÍNDICE com esta lista: manter a mesma ordem.
//
// `demo`/`github` ficam undefined quando não existe URL pública real — o
// botão correspondente simplesmente não é renderizado (nunca um link "#").
//
// `media` só existe quando há uma captura REAL do projeto (página publicada
// ou telas do app). Sem ela, o card mostra um painel de marca (nome +
// categoria) — nunca um mockup que pareça uma captura de tela real.
//   - "screenshot": captura desktop 16:10 da página publicada.
//   - "phone": telas do app mobile, exibidas em moldura de smartphone.
export type ProjectMedia =
  | { kind: "screenshot"; src: StaticImageData }
  | { kind: "phone"; screens: readonly [StaticImageData, StaticImageData] };

export type Project = {
  title: string;
  technologies: string[];
  demo?: string;
  github?: string;
  featured: boolean;
  media?: ProjectMedia;
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
    media: { kind: "phone", screens: [dietaHome, dietaResult] },
  },
  {
    title: "Pet Shop Premium",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    demo: "https://petshop-zenaldo.netlify.app/",
    github: "https://github.com/zenaldo-oliveira/petshop-blad",
    featured: false,
    media: { kind: "screenshot", src: petShopShot },
  },
  {
    title: "Barber Shop Premium",
    technologies: ["HTML", "SCSS", "JavaScript", "AOS"],
    demo: "https://barber-premium-site.netlify.app/",
    github: "https://github.com/zenaldo-oliveira/BARBER",
    featured: false,
    media: { kind: "screenshot", src: barberShot },
  },
  {
    title: "Text To Voice AI",
    technologies: ["HTML", "CSS", "JavaScript", "Web Speech API"],
    demo: "https://conversortxt.netlify.app/",
    github: "https://github.com/zenaldo-oliveira/Text-to-Voice",
    featured: false,
    media: { kind: "screenshot", src: textToVoiceShot },
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
