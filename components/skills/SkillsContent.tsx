"use client";

import { AnimatedHeadline } from "@/components/AnimatedHeadline";
import {
  Code2,
  Database,
  Brain,
  GitBranch,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import { revealContainer, revealItem } from "@/lib/motion/variants";

// Ícone, gradiente e nomes de tecnologias — não traduzidos, casados por
// índice com t.skills.categories.
const categoryMeta = [
  {
    icon: Code2,
    color: "from-cyan-500 to-blue-500",
    items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "HTML5", "CSS3"],
  },
  {
    icon: Database,
    color: "from-emerald-500 to-green-500",
    items: ["Node.js", "Express", "Prisma ORM", "PostgreSQL", "MySQL", "REST API"],
  },
  {
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    items: [
      "OpenAI",
      "Agentes IA",
      "WhatsApp Automation",
      "Chatbots",
      "Prompt Engineering",
      "Integração APIs",
      "Automação de Vendas",
    ],
  },
  {
    icon: GitBranch,
    color: "from-orange-500 to-red-500",
    items: ["Git", "GitHub", "Postman", "Figma", "VS Code", "ESLint"],
  },
];

const statColors = ["text-accent", "text-purple-400", "text-emerald-400"];

export function SkillsContent() {
  const t = useTranslations();
  const prefersReducedMotion = useReducedMotion();
  const headlineSequence = t.skills.headlineSequence.flatMap((text) => [
    text,
    2000,
  ]);

  return (
    <section
      id="skills"
      className="
    relative
    flex
    min-h-screen
    items-center
    justify-center
    overflow-hidden
    bg-gradient-to-b
    from-background
    via-[#0f172a]
    to-background
    px-6
    py-8
    text-text-primary
  "
    >
      {/* Blur Background */}
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />
      <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-purple-500/20 blur-[120px]" />

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-accent">
            <Sparkles size={16} />
            {t.skills.badge}
          </span>

          <h1 className="mt-6 min-h-[80px] text-4xl font-bold md:text-6xl">
            <AnimatedHeadline
              sequence={headlineSequence}
              className="
              bg-gradient-to-r
              from-cyan-400
              via-blue-400
              to-purple-400
              bg-clip-text
              text-transparent
              "
            />
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-text-secondary">
            {t.skills.description}
          </p>
        </div>

        {/* Cards */}
        <motion.div
          initial={prefersReducedMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={revealContainer}
          className="
          grid
          gap-6
          md:grid-cols-2
          lg:grid-cols-2
          xl:grid-cols-4
          items-stretch
        "
        >
          {t.skills.categories.map((category, index) => {
            const meta = categoryMeta[index];
            const Icon = meta.icon;

            return (
              <motion.div
                key={category.title}
                variants={revealItem}
                className="
              group
              relative
              h-full
              overflow-hidden
              rounded-3xl
              border
              border-border
              bg-surface
              backdrop-blur-xl
              transition-all
              duration-500
              hover:-translate-y-3
              hover:border-cyan-500/40
              hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]
            "
              >
                {/* Glow */}
                <div
                  className={`
                    absolute inset-0 opacity-0 transition-opacity duration-500
                    bg-gradient-to-br ${meta.color}
                    blur-3xl
                    group-hover:opacity-10
                  `}
                />

                <div className="relative p-8">
                  {/* Icon */}
                  <div
                    className={`
                      mb-6 flex h-14 w-14 items-center justify-center
                      rounded-2xl bg-gradient-to-br ${meta.color}
                    `}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  {/* Title */}
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-text-primary">
                      {category.title}
                    </h2>

                    <ArrowUpRight
                      size={18}
                      className="
                        text-text-secondary
                        transition-all
                        group-hover:text-accent
                        group-hover:translate-x-1
                        group-hover:-translate-y-1
                      "
                    />
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {meta.items.map((item) => (
                      <span
                        key={item}
                        className="
                          rounded-full
                          border
                          border-border
                          bg-white/5
                          px-3
                          py-1.5
                          text-xs
                          text-text-secondary
                          transition-all
                          duration-300
                          hover:border-cyan-500/30
                          hover:text-cyan-300
                        "
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer Stats */}
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {t.skills.stats.map((stat, index) => (
            <div
              key={stat.label}
              className="rounded-3xl border border-border bg-surface p-6 text-center"
            >
              <h3 className={`text-4xl font-bold ${statColors[index]}`}>
                {stat.value}
              </h3>
              <p className="mt-2 text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
