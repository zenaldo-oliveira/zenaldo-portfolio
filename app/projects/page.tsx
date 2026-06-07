"use client";

import { ExternalLink, FolderKanban, Code2, Globe } from "lucide-react";
import { TypeAnimation } from "react-type-animation";

export default function ProjectsPage() {
  const projects = [
    /* =========================
      ⭐ PROJETOS DESTAQUE
  ========================= */
    {
      title: "Sistema de Clínicas",
      description: "Gerenciamento de pacientes, médicos e consultas.",
      technologies: ["Next.js", "Prisma", "PostgreSQL"],
      demo: "#",
      github: "#",
      status: "Em desenvolvimento",
    },

    {
      title: "Sistema Self Checkup",
      description: "Sistema de autoatendimento inspirado no McDonald's.",
      technologies: ["React", "Prisma", "Tailwind"],
      demo: "#",
      github: "#",
      status: "Concluído",
    },

    {
      title: "Dashboard Administrativo",
      description: "Painel completo com métricas e gerenciamento.",
      technologies: ["Next.js", "TypeScript", "Chart.js"],
      demo: "#",
      github: "#",
      status: "Concluído",
    },

    {
      title: "Sistema de Agendamento",
      description: "Controle de horários e gestão de atendimentos.",
      technologies: ["React", "Node.js", "PostgreSQL"],
      demo: "#",
      github: "#",
      status: "Concluído",
    },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#020617] px-6 py-10">
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

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center">
        {/* Badge */}
        <span
          className="
          mb-6 flex items-center gap-2
          rounded-full border border-cyan-500/20
          bg-cyan-500/10 px-4 py-2
          text-sm font-medium text-cyan-400
        "
        >
          <FolderKanban size={16} />
          Projetos Desenvolvidos
        </span>

        {/* Título */}
        <h1 className="mb-4 text-center text-4xl font-black md:text-5xl">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 bg-clip-text text-transparent">
            <TypeAnimation
              sequence={[
                "Aplicações Modernas",
                2000,
                "Projetos Full Stack",
                2000,
                "Soluções Digitais",
                2000,
                "Produtos SaaS",
                2000,
              ]}
              speed={50}
              repeat={Infinity}
            />
          </span>
        </h1>

        {/* Descrição */}
        <p className="mb-4 max-w-2xl text-center text-sm text-zinc-400">
          Projetos desenvolvidos com React, Next.js, TypeScript, Prisma e
          PostgreSQL.
        </p>

        {/* Cards */}
        <div className="grid w-full gap-6 md:grid-cols-2 xl:grid-cols-2">
          {projects.map((project, index) => (
            <div
              key={index}
              className="
                group overflow-hidden rounded-3xl
                border border-white/10
                bg-white/[0.03]
                backdrop-blur-xl
                transition-all duration-300
                hover:-translate-y-2
                hover:border-cyan-500/40
                hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]
              "
            >
              {/* Topo */}
              <div
                className="
                  flex items-center justify-center
                  border-b border-white/10
                  bg-gradient-to-br
                  from-cyan-500/10
                  to-blue-500/5
                  p-5
                "
              >
                <Code2
                  size={28}
                  className="
                    text-cyan-400
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                />
              </div>

              {/* Conteúdo */}
              <div className="flex h-full flex-col p-3">
                <span
                  className="
                    rounded-full
                    bg-green-500/10
                    px-3 py-1
                    text-xs
                    font-medium
                    text-green-400
                  "
                >
                  {project.status}
                </span>

                <h2 className="mt-3 text-xl font-bold text-white">
                  {project.title}
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {project.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
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

                <div className="mt-6 flex gap-3">
                  <a
                    href={project.demo}
                    className="
                      flex flex-1 items-center justify-center gap-2
                      rounded-xl bg-cyan-500 px-4 py-2
                      text-sm font-semibold text-white
                      transition hover:bg-cyan-600
                    "
                  >
                    <ExternalLink size={16} />
                    Demo
                  </a>

                  <a
                    href={project.github}
                    className="
                    flex flex-1 items-center justify-center gap-2
                    rounded-xl border border-white/10
                    bg-white/5 px-4 py-2
                    text-sm text-white
                    transition hover:bg-white/10
                    "
                  >
                    <Globe size={16} />
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
