"use client";

/* ==========================================================
   IMPORTAÇÕES
========================================================== */

import Link from "next/link";
import {
  Brain,
  Code2,
  Database,
  Layers3,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { TypeAnimation } from "react-type-animation";

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
            <TypeAnimation
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
              speed={50}
              repeat={Infinity}
            />
          </span>
        </h1>

        {/* ==========================================================
            DESCRIÇÃO
        ========================================================== */}

        <p className="mb-8 max-w-2xl text-center text-sm text-zinc-400 md:text-base">
          Desenvolvimento de aplicações modernas utilizando React, Next.js,
          TypeScript, Prisma e PostgreSQL.
        </p>

        {/* ==========================================================
            GRID DE SERVIÇOS
        ========================================================== */}

        <div className="grid w-full max-w-6xl gap-4 md:grid-cols-2 xl:grid-cols-4">
          {/* ==========================================================
              CARD 1 - DESENVOLVIMENTO WEB
          ========================================================== */}

          <div className="group rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/40">
            <Code2
              size={32}
              className="mb-4 text-cyan-400 transition-transform duration-300 group-hover:scale-110"
            />

            <h3 className="mb-3 text-xl font-semibold text-white">
              Desenvolvimento Web
            </h3>

            <p className="text-sm text-zinc-400">
              Sites modernos, landing pages e interfaces responsivas.
            </p>
          </div>

          {/* ==========================================================
              CARD 2 - SISTEMAS FULL STACK
          ========================================================== */}

          <div className="group rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/40">
            <Layers3
              size={32}
              className="mb-4 text-cyan-400 transition-transform duration-300 group-hover:scale-110"
            />

            <h3 className="mb-3 text-xl font-semibold text-white">
              Sistemas Full Stack
            </h3>

            <p className="text-sm text-zinc-400">
              Frontend, backend, autenticação e banco de dados.
            </p>
          </div>

          {/* ==========================================================
              CARD 3 - APIS E BACKEND
          ========================================================== */}

          <div className="group rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/40">
            <Database
              size={32}
              className="mb-4 text-cyan-400 transition-transform duration-300 group-hover:scale-110"
            />

            <h3 className="mb-3 text-xl font-semibold text-white">
              APIs & Backend
            </h3>

            <p className="text-sm text-zinc-400">
              APIs REST, integrações, Prisma ORM e PostgreSQL.
            </p>
          </div>

          {/* ==========================================================
              CARD 4 - IA E AUTOMAÇÃO
          ========================================================== */}

          <div className="group rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/40">
            <Brain
              size={32}
              className="mb-4 text-cyan-400 transition-transform duration-300 group-hover:scale-110"
            />

            <h3 className="mb-3 text-xl font-semibold text-white">
              IA & Automação
            </h3>

            <p className="text-sm text-zinc-400">
              IA, WhatsApp, Make e automação de processos.
            </p>
          </div>
        </div>

        {/* ==========================================================
            CTA FINAL
        ========================================================== */}

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
