"use client";

import Link from "next/link";
import { useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";

import {
  Sparkles,
  Phone,
  Mail,
  Send,
  Globe,
  Clock3,
  Briefcase,
  Rocket,
  Code2,
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const text = `


🚀 Novo contato pelo Portfólio

👤 Nome: ${name}

📧 E-mail: ${email}

💬 Mensagem:
${message}
`;

    const url = `https://wa.me/5565992832422?text=${encodeURIComponent(text)}`;

    window.open(url, "_blank");

    setName("");
    setEmail("");
    setMessage("");
  };

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
              <TypeAnimation
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
                speed={50}
                repeat={Infinity}
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
    "
          >
            <div className="flex items-center gap-2">
              <Phone size={18} />
              WhatsApp
            </div>
          </Link>

          {/* Email */}
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
    "
          >
            <div className="flex items-center gap-2">
              <FaGithub size={18} />
              GitHub
            </div>
          </Link>

          {/* LinkedIn */}
          <Link
            href="https://linkedin.com/in/seu-link"
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

                <p className="text-zinc-500">
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

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-white/5
              px-4
              py-2.5
              text-sm
              text-white
              outline-none
              transition-all
              focus:border-cyan-500
            "
              />

              <input
                type="email"
                required
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-white/5
                px-4
                py-2.5
                text-sm
                text-white
                outline-none
                transition-all
                focus:border-cyan-500
              "
              />

              <textarea
                rows={3}
                required
                placeholder="Descreva seu projeto..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="
              w-full
              resize-none
              rounded-xl
              border
              border-white/10
              bg-white/5
              px-4
              py-2.5
              text-sm
              text-white
              outline-none
              transition-all
              focus:border-cyan-500
            "
              />

              <button
                type="submit"
                className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-gradient-to-r
            from-cyan-500
            to-blue-600
            px-4
            py-3
            text-sm
            font-semibold
            text-white
            transition-all
            duration-300
            hover:scale-[1.01]
          "
              >
                <Send size={16} />
                Enviar para WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="mt-4 border-t border-white/10 pt-4 text-center">
        <p className="text-xs text-zinc-500">
          © {new Date().getFullYear()} Zenaldo Oliveira • Full Stack Developer
        </p>
      </div>
    </section>
  );
}
