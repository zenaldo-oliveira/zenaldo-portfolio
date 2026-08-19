import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { AnimatedHeadline } from "@/components/AnimatedHeadline";
import { ContactForm } from "@/components/contact/ContactForm";

import { Sparkles, Phone, Mail, Code2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato | Zenaldo Oliveira — Desenvolvedor Full Stack",
  description:
    "Estou disponível para freelas, desenvolvimento de sistemas, landing pages, dashboards, integrações com APIs e projetos Full Stack. Entre em contato pelo WhatsApp, e-mail, GitHub ou LinkedIn.",
  keywords: [
    "contato desenvolvedor full stack",
    "orçamento site profissional",
    "contratar desenvolvedor React Next.js",
  ],
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-[#020617]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#06b6d420,transparent_50%)]" />
      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[180px]" />
      <div
        className="
    absolute inset-0
    opacity-[0.03]
    bg-[linear-gradient(to_right,rgba(124, 122, 122, 0.15)_1px,transparent_1px),
    linear-gradient(to_bottom,rgba(255,255,255,0.15)_1px,transparent_1px)]
    bg-[size:60px_60px]
  "
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        {/* Badge */}
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400">
            <Sparkles size={16} />
            Entre em Contato
          </span>
        </div>

        {/* Hero */}
        <div className="mt-8 text-center">
          <h1 className="mx-auto max-w-4xl text-3xl font-black text-white md:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 bg-clip-text text-transparent">
              <AnimatedHeadline
                sequence={[
                  "Vamos criar algo incrível?",
                  2000,
                  "Soluções Full Stack",
                  2000,
                  "Apps modernas e rápidas",
                  2000,
                  "React • Next.js • Node.js",
                  2000,
                ]}
              />
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-400 md:text-base">
            Estou disponível para freelas, desenvolvimento de sistemas, landing
            pages, dashboards, integrações com APIs e projetos Full Stack.
          </p>
        </div>

        {/* Links rápidos */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {/* WhatsApp */}
          <Link
            href="https://wa.me/5565992832422"
            target="_blank"
            className="
      rounded-2xl
      border border-[#25D366]/30
      bg-[#25D366]/10
      px-5 py-3
      text-[#25D366]
      transition-all duration-300
      hover:-translate-y-1
      hover:border-[#25D366]
      hover:bg-[#25D366]/20
      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-cyan-500/60
    "
          >
            <div className="flex items-center gap-2">
              <Phone size={18} />
              WhatsApp
            </div>
          </Link>

          {/* Email */}
          {/* TODO: substituir pelo e-mail profissional real assim que definido */}
          <Link
            href="mailto:seuemail@email.com"
            className="
      rounded-2xl
      border border-[#F4F2EE]/20
      bg-[#F4F2EE]/10
      px-5 py-3
      text-[#F4F2EE]
      transition-all duration-300
      hover:-translate-y-1
      hover:border-[#F4F2EE]/50
      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-cyan-500/60
    "
          >
            <div className="flex items-center gap-2">
              <Mail size={18} />
              E-mail
            </div>
          </Link>

          {/* GitHub */}
          <Link
            href="https://github.com/zenaldo-oliveira"
            target="_blank"
            className="
      rounded-2xl
      border border-zinc-700
      bg-zinc-900
      px-5 py-3
      text-white
      transition-all duration-300
      hover:-translate-y-1
      hover:border-zinc-500
      hover:bg-zinc-800
      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-cyan-500/60
    "
          >
            <div className="flex items-center gap-2">
              <FaGithub size={18} />
              GitHub
            </div>
          </Link>

          {/* LinkedIn */}
          <Link
            href="https://www.linkedin.com/in/zenaldo-pereira-oliveira/"
            target="_blank"
            className="
      rounded-2xl
      border border-[#0A66C2]/30
      bg-[#0A66C2]/15
      px-5 py-3
      text-[#0A66C2]
      transition-all duration-300
      hover:-translate-y-1
      hover:border-[#0A66C2]
      hover:bg-[#0A66C2]/25
      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-cyan-500/60
    "
          >
            <div className="flex items-center gap-2">
              <FaLinkedin size={18} />
              LinkedIn
            </div>
          </Link>
        </div>

        {/* Grid Principal */}
        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {/* Sobre */}
          <div className="rounded-3xl border border-cyan-500/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
                <Code2 className="text-cyan-400" size={28} />
              </div>

              <div>
                <h2 className="mb-3 text-xl font-bold text-white md:text-2xl">
                  Desenvolvedor Full Stack
                </h2>

                <p className="text-zinc-400">
                  React • Next.js • Node.js • TypeScript
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-lg bg-cyan-500/10 px-2 py-1 text-xs text-cyan-400">
                🚀 Freelas
              </span>

              <span className="rounded-lg bg-cyan-500/10 px-2 py-1 text-xs text-cyan-400">
                ⚡ Até 24h
              </span>

              <span className="rounded-lg bg-cyan-500/10 px-2 py-1 text-xs text-cyan-400">
                💻 Full Stack
              </span>
            </div>

            <div className="mt-8 rounded-2xl border border-cyan-500/10 bg-cyan-500/5 p-5">
              <p className="text-zinc-300">
                🚀 Sempre buscando criar produtos digitais de alta qualidade.
              </p>
            </div>
          </div>

          {/* Formulário */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <h2 className="mb-4 text-2xl font-bold text-white">
              Enviar Mensagem
            </h2>

            <ContactForm />
          </div>
        </div>
      </div>
      <div className="mt-4 border-t border-white/10 pt-4 text-center">
        <p className="text-xs text-zinc-400">
          © {new Date().getFullYear()} Zenaldo Oliveira • Full Stack Developer
        </p>
      </div>
    </section>
  );
}
