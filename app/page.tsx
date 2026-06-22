"use client";

import ParticlesBackground from "@/components/ParticlesBackground";
import Link from "next/link";
import { ArrowRight, Sparkles, Code2, Database, Brain } from "lucide-react";
import { TypeAnimation } from "react-type-animation";

export default function Home() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 md:px-6">
      {/* Background */}
      <ParticlesBackground />

      <div className="absolute inset-0 bg-[#020617]/80" />

      {/* Conteúdo */}
      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/5 px-4 py-2 text-sm text-cyan-400 backdrop-blur-md">
          <Sparkles size={16} />
          Desenvolvimento • Automação • IA
        </span>

        {/* Título */}
        <h1 className="mt-6 text-4xl font-black leading-tight text-white md:text-5xl">
          Transformando negócios com
        </h1>

        <span className="mt-2 block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent text-4xl font-black md:text-5xl">
          <TypeAnimation
            sequence={[
              "Agentes de IA",
              2000,
              "Sites Profissionais",
              2000,
              "Sistemas Web",
              2000,
              "Automações Inteligentes",
              2000,
            ]}
            speed={50}
            repeat={Infinity}
            wrapper="span"
          />
        </span>

        {/* Descrição */}
        <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-zinc-400 md:text-base">
          Transformamos ideias em soluções digitais através de
          <span className="font-medium text-cyan-400">
            {" "}
            sites profissionais, sistemas web, automações e agentes de IA
          </span>
          , ajudando empresas a vender mais, economizar tempo e automatizar
          processos.
        </p>

        {/* Botões */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/projects"
            className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:scale-105"
          >
            Ver Projetos
            <ArrowRight size={16} />
          </Link>

          <Link
            href="/contact"
            className="rounded-xl border border-zinc-700 px-6 py-3 text-sm text-white transition-all duration-300 hover:border-cyan-500 hover:bg-cyan-500/10"
          >
            Entrar em Contato
          </Link>
        </div>

        {/* Cards */}
        <div className="mt-10 grid w-full gap-4 md:grid-cols-3">
          <div className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40">
            <Code2
              size={30}
              className="mx-auto mb-3 text-cyan-400 transition-transform group-hover:scale-110"
            />

            <h3 className="text-lg font-semibold text-white">Frontend</h3>

            <p className="mt-2 text-sm text-zinc-400">
              React, Next.js, TypeScript e interfaces modernas.
            </p>
          </div>

          <div className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40">
            <Database
              size={30}
              className="mx-auto mb-3 text-cyan-400 transition-transform group-hover:scale-110"
            />

            <h3 className="text-lg font-semibold text-white">Backend & APIs</h3>

            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Desenvolvimento de APIs REST, autenticação, Prisma ORM e
              PostgreSQL.
            </p>
          </div>

          <div className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40">
            <Brain
              size={30}
              className="mx-auto mb-3 text-cyan-400 transition-transform group-hover:scale-110"
            />

            <h3 className="text-lg font-semibold text-white">
              Inteligência Artificial
            </h3>

            <p className="mt-2 text-sm text-zinc-400">
              IA, automações e integração com modelos inteligentes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
