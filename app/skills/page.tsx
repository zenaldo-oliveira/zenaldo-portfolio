"use client";

import { TypeAnimation } from "react-type-animation";

import {
  Code2,
  Database,
  Brain,
  GitBranch,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

const skills = [
  {
    title: "Frontend",
    icon: Code2,
    color: "from-cyan-500 to-blue-500",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "HTML5",
      "CSS3",
    ],
  },
  {
    title: "Backend",
    icon: Database,
    color: "from-emerald-500 to-green-500",
    items: [
      "Node.js",
      "Express",
      "Prisma ORM",
      "PostgreSQL",
      "MySQL",
      "REST API",
    ],
  },
  {
    title: "IA & Automação",
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
    title: "Ferramentas",
    icon: GitBranch,
    color: "from-orange-500 to-red-500",
    items: ["Git", "GitHub", "Postman", "Figma", "VS Code", "ESLint"],
  },
];

export default function SkillsSection() {
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
    from-[#020617]
    via-[#0f172a]
    to-[#020617]
    px-6
    py-8
    text-white
  "
    >
      {/* Blur Background */}
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />
      <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-purple-500/20 blur-[120px]" />

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400">
            <Sparkles size={16} />
            Tecnologias & Soluções
          </span>

          <h2 className="mt-6 min-h-[80px] text-4xl font-bold md:text-6xl">
            <TypeAnimation
              sequence={[
                "Sites que Vendem",
                2000,
                "Sistemas para Empresas",
                2000,
                "Agentes de IA",
                2000,
                "Automação de Processos",
                2000,
                "Tecnologia para Negócios",
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="
              bg-gradient-to-r
              from-cyan-400
              via-blue-400
              to-purple-400
              bg-clip-text
              text-transparent
              "
            />
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-zinc-400">
            Desenvolvimento Full Stack, Inteligência Artificial e automações
            para criar soluções modernas, escaláveis e focadas em resultados.
          </p>
        </div>

        {/* Cards */}
        <div
          className="
          grid
          gap-6
          md:grid-cols-2
          lg:grid-cols-2
          xl:grid-cols-4
          items-stretch
        "
        >
          {skills.map((skill) => {
            const Icon = skill.icon;
            return (
              <div
                key={skill.title}
                className="
              group
              relative
              h-full
              overflow-hidden
              rounded-3xl
              border
              border-white/10
              bg-white/[0.03]
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
                    bg-gradient-to-br ${skill.color}
                    blur-3xl
                    group-hover:opacity-10
                  `}
                />

                <div className="relative p-8">
                  {/* Icon */}
                  <div
                    className={`
                      mb-6 flex h-14 w-14 items-center justify-center
                      rounded-2xl bg-gradient-to-br ${skill.color}
                    `}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  {/* Title */}
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-white">
                      {skill.title}
                    </h3>

                    <ArrowUpRight
                      size={18}
                      className="
                        text-zinc-500
                        transition-all
                        group-hover:text-cyan-400
                        group-hover:translate-x-1
                        group-hover:-translate-y-1
                      "
                    />
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map((item) => (
                      <span
                        key={item}
                        className="
                          rounded-full
                          border
                          border-white/10
                          bg-white/5
                          px-3
                          py-1.5
                          text-xs
                          text-zinc-300
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
              </div>
            );
          })}
        </div>

        {/* Footer Stats */}
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <h4 className="text-4xl font-bold text-cyan-400">15+</h4>
            <p className="mt-2 text-zinc-400">Tecnologias</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <h4 className="text-4xl font-bold text-purple-400">Full Stack</h4>
            <p className="mt-2 text-zinc-400">Frontend & Backend</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center">
            <h4 className="text-4xl font-bold text-emerald-400">IA</h4>
            <p className="mt-2 text-zinc-400">Automações Inteligentes</p>
          </div>
        </div>
      </div>
    </section>
  );
}
