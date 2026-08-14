/* ==========================================================
   IMPORTAÇÕES
========================================================== */

import Link from "next/link";
import {
  Brain,
  Building2,
  Code2,
  Layers3,
  Plug,
  Workflow,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { AnimatedHeadline } from "@/components/AnimatedHeadline";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Serviços | ZTech Solutions — Desenvolvimento de Software",
  description:
    "Sistemas empresariais, SaaS, inteligência artificial, automação, sistemas web e integrações — desenvolvidos com React, Next.js, TypeScript, Prisma e PostgreSQL.",
  keywords: [
    "sistemas empresariais",
    "desenvolvimento de SaaS",
    "inteligência artificial para empresas",
    "automação de processos",
    "integração de sistemas",
    "desenvolvimento de software",
  ],
  alternates: {
    canonical: "/services",
  },
};

const services = [
  {
    icon: Building2,
    title: "Sistemas Empresariais",
    description:
      "Sistemas sob medida para gestão, operação, clientes e processos — no lugar de planilhas soltas e controle manual.",
  },
  {
    icon: Layers3,
    title: "SaaS",
    description:
      "Transformamos uma solução em produto: plataforma escalável, pronta para atender vários clientes.",
  },
  {
    icon: Brain,
    title: "Inteligência Artificial",
    description:
      "IA aplicada a atendimento, qualificação de leads e suporte, reduzindo trabalho manual repetitivo.",
  },
  {
    icon: Workflow,
    title: "Automação",
    description:
      "Processos repetitivos automatizados entre sistemas, WhatsApp e ferramentas do dia a dia da empresa.",
  },
  {
    icon: Code2,
    title: "Sistemas Web",
    description:
      "Aplicações modernas e responsivas, desenvolvidas de acordo com a necessidade real do negócio.",
  },
  {
    icon: Plug,
    title: "Integrações",
    description:
      "Conectamos APIs, bancos de dados e serviços para eliminar retrabalho entre sistemas que não conversam entre si.",
  },
];

export default function ServicesPage() {
  return (
    /* ==========================================================
       SEÇÃO PRINCIPAL
    ========================================================== */
    <section className="relative min-h-screen overflow-hidden bg-[#020617] px-6 py-6">
      {/* ==========================================================
          BACKGROUND
      ========================================================== */}

      {/* Fundo principal */}
      <div className="absolute inset-0 bg-[#020617]" />

      {/* Gradiente superior */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#06b6d420,transparent_50%)]" />

      {/* Glow central */}
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[150px]" />

      {/* Grid decorativo */}
      <div
        className="
          absolute inset-0
          opacity-[0.03]
          bg-[linear-gradient(to_right,rgba(255,255,255,0.15)_1px,transparent_1px),
          linear-gradient(to_bottom,rgba(255,255,255,0.15)_1px,transparent_1px)]
          bg-[size:60px_60px]
        "
      />

      {/* ==========================================================
          CONTEÚDO PRINCIPAL
      ========================================================== */}

      <div
        className="
          relative z-10
          mx-auto
          flex
          min-h-[90vh]
          w-full
          max-w-7xl
          flex-col
          items-center
          justify-center
        "
      >
        {/* ==========================================================
            BADGE
        ========================================================== */}

        <span
          className="
            mb-6 flex items-center gap-2
            rounded-full
            border border-cyan-500/20
            bg-cyan-500/10
            px-4 py-2
            text-sm font-medium
            text-cyan-400
          "
        >
          <Sparkles size={16} />
          Serviços
        </span>

        {/* ==========================================================
            TÍTULO
        ========================================================== */}

        <h1 className="mb-4 min-h-[70px] text-center text-4xl font-black md:min-h-[80px] md:text-5xl">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 bg-clip-text text-transparent">
            <AnimatedHeadline
              sequence={[
                "Desenvolvendo Soluções Digitais",
                2000,
                "Aplicações Full Stack",
                2000,
                "Projetos SaaS",
                2000,
                "IA e Automações",
                2000,
              ]}
            />
          </span>
        </h1>

        {/* ==========================================================
            DESCRIÇÃO
        ========================================================== */}

        <p className="mb-8 max-w-2xl text-center text-sm text-zinc-400 md:text-base">
          Desenvolvimento de sistemas empresariais, SaaS, automações e
          soluções com inteligência artificial, usando React, Next.js,
          TypeScript, Prisma e PostgreSQL.
        </p>

        {/* ==========================================================
            GRID DE SERVIÇOS
        ========================================================== */}

        <div className="grid w-full max-w-6xl gap-4 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="group rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/40"
              >
                <Icon
                  size={32}
                  className="mb-4 text-cyan-400 transition-transform duration-300 group-hover:scale-110"
                />

                <h2 className="mb-3 text-xl font-semibold text-white">
                  {service.title}
                </h2>

                <p className="text-sm text-zinc-400">{service.description}</p>
              </div>
            );
          })}
        </div>

        {/* ==========================================================
            CTA FINAL
        ========================================================== */}

        <div className="mt-10 text-center">
          <h2 className="text-2xl font-bold text-white">
            Vamos transformar sua ideia em realidade?
          </h2>

          <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="
        flex items-center justify-center gap-2
        rounded-xl
        bg-cyan-500
        px-6 py-3
        font-semibold
        text-black
        transition-all
        duration-300
        hover:scale-105
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60
      "
            >
              Entrar em Contato
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/projects"
              className="
        rounded-xl
        border
        border-white/10
        bg-white/5
        px-6 py-3
        font-semibold
        text-white
        transition-all
        duration-300
        hover:bg-white/10
        hover:border-cyan-500/30
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60
      "
            >
              Ver Projetos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
