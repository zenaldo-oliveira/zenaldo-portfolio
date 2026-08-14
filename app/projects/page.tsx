import { AnimatedHeadline } from "@/components/AnimatedHeadline";
import { ExternalLink, FolderKanban, Code2, Globe } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cases e Projetos | ZTech Solutions",
  description:
    "Cases e projetos desenvolvidos pela ZTech Solutions: sistemas, plataformas e aplicações reais, com o problema resolvido e a solução entregue em cada um.",
  keywords: [
    "cases de desenvolvimento de software",
    "projetos full stack",
    "sistema de gestão",
    "React Native",
    "Next.js",
    "inteligência artificial",
  ],
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsPage() {
  const projects = [
    {
      title: "🛗 ZLift Manager",
      category: "Plataforma / SaaS",
      problema:
        "Empresas de manutenção de elevadores costumam operar com processos manuais e informações dispersas entre clientes, equipamentos, técnicos e ordens de serviço.",
      solucao:
        "Plataforma própria que centraliza todo o fluxo operacional: clientes, elevadores, técnicos, ordens de serviço, execução, checklist, fotos, observações, assinatura e relatório.",
      technologies: [] as string[],
      demo: "#",
      github: "#",
      status: "Produto próprio",
      featured: true,
    },

    {
      title: "🥗 Dieta IA",
      category: "Aplicativo Mobile",
      problema:
        "Montar uma dieta personalizada normalmente depende de acompanhamento manual, sem cruzar automaticamente todos os dados do usuário.",
      solucao:
        "Aplicativo mobile Full Stack com Inteligência Artificial (Gemini AI) que gera dietas personalizadas a partir de peso, altura, idade, objetivo e nível de atividade física.",
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
      status: "🏆 Projeto Principal",
      featured: true,
    },

    {
      title: "🐾 Pet Shop Premium",
      category: "Site Institucional",
      problema:
        "Pet shops locais sem presença digital profissional perdem clientes para concorrentes com site e canal de contato direto.",
      solucao:
        "Website profissional com design moderno, responsivo e integração direta com WhatsApp para captação de clientes.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
      demo: "https://petshop-zenaldo.netlify.app/",
      github: "https://github.com/zenaldo-oliveira/petshop-blad",
      status: "🌐 Online",
    },

    {
      title: "💈 Barber Shop Premium",
      category: "Site Institucional",
      problema:
        "Barbearias que dependem só de indicação ou redes sociais têm dificuldade para converter interesse em agendamento.",
      solucao:
        "Site profissional com design responsivo, integração com WhatsApp e foco em geração de agendamentos.",
      technologies: ["HTML", "SCSS", "JavaScript", "AOS"],
      demo: "https://barber-premium-site.netlify.app/",
      github: "https://github.com/zenaldo-oliveira/BARBER",
      status: "🌐 Online",
    },

    {
      title: "🔊 Text To Voice AI",
      category: "Ferramenta Web",
      problema:
        "Conteúdo em texto nem sempre é acessível para todos os usuários ou contextos de uso.",
      solucao:
        "Aplicação web que converte texto em áudio usando síntese de voz via Web Speech API, sem depender de serviços pagos de terceiros.",
      technologies: ["HTML", "CSS", "JavaScript", "Web Speech API"],
      demo: "https://conversortxt.netlify.app/",
      github: "https://github.com/zenaldo-oliveira/Text-to-Voice",
      status: "🌐 Online",
    },

    {
      title: "EasyCar Mobile",
      category: "Aplicativo Mobile",
      problema:
        "Gestão automotiva (veículos, clientes, serviços) sem um sistema dedicado costuma ficar espalhada entre planilhas e anotações.",
      solucao:
        "Aplicativo mobile integrado a um backend próprio para centralizar a gestão automotiva.",
      technologies: ["React Native", "JavaScript", "Node.js"],
      demo: "#",
      github: "https://github.com/zenaldo-oliveira/Frontend-easycar-mobile",
      status: "Em Desenvolvimento",
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

      <div className="relative z-10 mx-auto flex w-full max-w-[1700px] flex-col items-center">
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
          Cases e Projetos
        </span>

        {/* Título */}
        <h1 className="mb-3 min-h-[80px] text-center text-3xl font-black md:min-h-[100px] md:text-5xl">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 bg-clip-text text-transparent">
            <AnimatedHeadline
              sequence={[
                "Sistemas para Empresas",
                2000,
                "Sites Profissionais",
                2000,
                "Automações Inteligentes",
                2000,
                "Aplicações Full Stack",
                2000,
              ]}
            />
          </span>
        </h1>

        {/* Descrição */}
        <p className="mb-4 max-w-2xl text-center text-sm text-zinc-400">
          Cada case abaixo mostra o problema real e a solução entregue —
          desenvolvidos com React, Next.js, React Native, Inteligência
          Artificial e soluções escaláveis para empresas.
        </p>

        {/* Cards */}
        <div className="grid w-full auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`
        h-full
        group overflow-hidden rounded-3xl
        border
        ${
          project.featured
            ? "border-yellow-400 shadow-[0_0_40px_rgba(250,204,21,0.25)]"
            : "border-white/10"
        }
        bg-white/[0.03]
        backdrop-blur-xl
        transition-all duration-300
        hover:-translate-y-2
        hover:border-cyan-500/40
      `}
            >
              {/* Conteúdo */}
              <div className="flex h-full flex-col p-4">
                <div className="mb-3 flex justify-center">
                  <Code2
                    size={24}
                    className="
                    text-cyan-400
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  "
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
                      project.featured
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-green-500/10 text-green-400"
                    }`}
                  >
                    {project.status}
                  </span>

                  <span className="w-fit rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-zinc-400">
                    {project.category}
                  </span>
                </div>

                <h2 className="mt-3 text-xl font-bold text-white">
                  {project.title}
                </h2>

                <div className="mt-3 space-y-3 text-sm">
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-cyan-400">
                      Problema
                    </span>
                    <p className="mt-1 text-zinc-400 line-clamp-2">
                      {project.problema}
                    </p>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wide text-cyan-400">
                      Solução
                    </span>
                    <p className="mt-1 text-zinc-400 line-clamp-2">
                      {project.solucao}
                    </p>
                  </div>
                </div>

                {project.technologies.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
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
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                    flex flex-1 items-center justify-center gap-1
                    rounded-lg bg-cyan-500 px-3 py-2
                    text-xs font-semibold text-white
                    transition hover:bg-cyan-600
                  "
                  >
                    <ExternalLink size={16} />
                    Demo
                  </a>

                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                    flex flex-1 items-center justify-center gap-1
                    rounded-lg border border-white/10
                    bg-white/5 px-3 py-2
                    text-xs text-white
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
