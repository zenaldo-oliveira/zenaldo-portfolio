"use client";

import { AnimatedHeadline } from "@/components/AnimatedHeadline";
import { ExternalLink, FolderKanban, Globe } from "lucide-react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import { revealContainer, revealItem } from "@/lib/motion/variants";

// Nomes de projetos, tecnologias e links — não traduzidos (nomes próprios /
// marcas reais). Casados por índice com t.projects.items.
//
// `image` fica undefined até existir uma screenshot real de cada projeto —
// nunca preenchido com um placeholder que pareça uma captura de tela real.
// Quando a imagem existir, basta adicionar o caminho aqui; o card já está
// pronto para renderizá-la via next/image sem nenhuma outra mudança.
const projectMeta: {
  title: string;
  technologies: string[];
  demo: string;
  github: string;
  featured: boolean;
  image?: string;
}[] = [
  {
    title: "🛗 ZLift Manager",
    technologies: [],
    demo: "#",
    github: "#",
    featured: true,
  },
  {
    title: "🥗 Dieta IA",
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
    title: "🐾 Pet Shop Premium",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
    demo: "https://petshop-zenaldo.netlify.app/",
    github: "https://github.com/zenaldo-oliveira/petshop-blad",
    featured: false,
  },
  {
    title: "💈 Barber Shop Premium",
    technologies: ["HTML", "SCSS", "JavaScript", "AOS"],
    demo: "https://barber-premium-site.netlify.app/",
    github: "https://github.com/zenaldo-oliveira/BARBER",
    featured: false,
  },
  {
    title: "🔊 Text To Voice AI",
    technologies: ["HTML", "CSS", "JavaScript", "Web Speech API"],
    demo: "https://conversortxt.netlify.app/",
    github: "https://github.com/zenaldo-oliveira/Text-to-Voice",
    featured: false,
  },
  {
    title: "EasyCar Mobile",
    technologies: ["React Native", "JavaScript", "Node.js"],
    demo: "#",
    github: "https://github.com/zenaldo-oliveira/Frontend-easycar-mobile",
    featured: false,
  },
];

export function ProjectsContent() {
  const t = useTranslations();
  const prefersReducedMotion = useReducedMotion();
  const headlineSequence = t.projects.headlineSequence.flatMap((text) => [
    text,
    2000,
  ]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-background px-6 py-10">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#77d4e41f,transparent_50%)]" />

      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[150px]" />

      <div
        className="
          absolute inset-0
          opacity-[0.03]
          bg-[linear-gradient(to_right,rgba(255,255,255,0.15)_1px,transparent_1px),
          linear-gradient(to_bottom,rgba(255,255,255,0.15)_1px,transparent_1px)]
          bg-[size:60px_60px]
        "
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1700px] flex-col items-center">
        {/* Badge */}
        <span
          className="
          mb-6 flex items-center gap-2
          rounded-full border border-cyan-500/20
          bg-cyan-500/10 px-4 py-2
          text-sm font-medium text-accent
        "
        >
          <FolderKanban size={16} />
          {t.projects.badge}
        </span>

        {/* Título */}
        <h1 className="mb-3 min-h-[80px] text-center text-3xl font-black md:min-h-[100px] md:text-5xl">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 bg-clip-text text-transparent">
            <AnimatedHeadline sequence={headlineSequence} />
          </span>
        </h1>

        {/* Descrição */}
        <p className="mb-4 max-w-2xl text-center text-sm text-text-secondary">
          {t.projects.description}
        </p>

        {/* Cards */}
        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={revealContainer}
          className="grid w-full auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {t.projects.items.map((project, index) => {
            const meta = projectMeta[index];

            return (
              <motion.div
                key={meta.title}
                variants={revealItem}
                className={`
        h-full
        group overflow-hidden rounded-3xl
        border
        ${
          meta.featured
            ? "border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.25)]"
            : "border-border"
        }
        bg-surface
        backdrop-blur-xl
        transition-all duration-300
        hover:-translate-y-2
        hover:border-cyan-500/40
      `}
              >
                {/* Prévia visual — usa a imagem real do projeto quando existir
                    (meta.image); até lá, mostra um painel estilizado em vez de
                    um placeholder que finja ser uma screenshot. */}
                <div className="relative aspect-video w-full overflow-hidden border-b border-border">
                  {meta.image ? (
                    <Image
                      src={meta.image}
                      alt={meta.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div
                      className="
                        flex h-full w-full items-center justify-center
                        bg-gradient-to-br from-cyan-500/10 via-surface to-blue-500/10
                      "
                    >
                      <FolderKanban
                        size={40}
                        className="text-accent/40 transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="flex h-full flex-col p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                        meta.featured
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-green-500/10 text-green-400"
                      }`}
                    >
                      {project.status}
                    </span>

                    <span className="w-fit rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-text-secondary">
                      {project.category}
                    </span>
                  </div>

                  <h2 className="mt-3 text-xl font-bold text-text-primary">
                    {meta.title}
                  </h2>

                  <div className="mt-3 space-y-3 text-sm">
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wide text-accent">
                        {t.projects.problemLabel}
                      </span>
                      <p className="mt-1 text-text-secondary line-clamp-2">
                        {project.problem}
                      </p>
                    </div>

                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wide text-accent">
                        {t.projects.solutionLabel}
                      </span>
                      <p className="mt-1 text-text-secondary line-clamp-2">
                        {project.solution}
                      </p>
                    </div>
                  </div>

                  {meta.technologies.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {meta.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="
                        rounded-lg
                        bg-cyan-500/10
                        px-3 py-1
                        text-xs
                        text-cyan-300
                      "
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex gap-3">
                    <a
                      href={meta.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                    flex flex-1 items-center justify-center gap-1
                    rounded-lg bg-cyan-500 px-3 py-2
                    text-xs font-semibold text-white
                    transition hover:bg-cyan-600
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60
                  "
                    >
                      <ExternalLink size={16} />
                      {t.projects.demoLabel}
                    </a>

                    <a
                      href={meta.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="
                    flex flex-1 items-center justify-center gap-1
                    rounded-lg border border-border
                    bg-white/5 px-3 py-2
                    text-xs text-text-primary
                    transition hover:bg-white/10
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60
                  "
                    >
                      <Globe size={16} />
                      {t.projects.githubLabel}
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
