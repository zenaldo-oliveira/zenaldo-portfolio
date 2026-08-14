import { AboutProfilePhoto } from "@/components/about/AboutProfilePhoto";
import { AboutFormationCard } from "@/components/about/AboutFormationCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre a ZTech Solutions",
  description:
    "A ZTech Solutions desenvolve soluções digitais personalizadas — sistemas web, SaaS, automações e agentes de inteligência artificial — para empresas que querem digitalizar processos e ganhar eficiência.",
  keywords: [
    "ZTech Solutions",
    "empresa de desenvolvimento de software",
    "sistemas empresariais",
    "SaaS",
    "React",
    "Next.js",
    "TypeScript",
  ],
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <section className="relative min-h-screen overflow-hidden px-6 py-10">
      {/* Background SaaS */}

      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0a1f52] to-[#020617]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#06b6d420,transparent_50%)]" />

      <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[150px]" />

      <div
        className="
          absolute inset-0 opacity-[0.05]
          bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),
          linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)]
          bg-[size:40px_40px]
        "
      />

      {/* Conteúdo */}
      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Cabeçalho */}
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center">
          <span
            className="
            inline-flex items-center gap-2
            rounded-full
            border border-cyan-500/20
            bg-gradient-to-r from-cyan-500 to-blue-600
            px-4 py-2
            text-sm font-medium
            text-cyan-400
          "
          >
            🚀 Sobre a ZTech Solutions
          </span>

          {/* Título */}
          <h1 className="mt-6 text-center text-3xl font-black text-white md:text-5xl">
            Software desenvolvido para resolver problemas reais.
          </h1>

          {/* Descrição institucional */}
          <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-7 text-zinc-400">
            A{" "}
            <span className="font-semibold text-cyan-400">
              ZTech Solutions
            </span>{" "}
            desenvolve soluções digitais personalizadas —{" "}
            <span className="font-medium text-white">
              sistemas web, SaaS, automações e agentes de inteligência
              artificial
            </span>{" "}
            — para empresas que querem digitalizar processos e ganhar
            eficiência.
          </p>
        </div>
        {/* Foto + Cards */}
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Foto */}
          <div className="flex justify-center">
            <div
              className="
                relative
                h-[320px]
                md:h-[400px]
                w-full
                max-w-[380px]
                perspective-[1000px]
                overflow-hidden
                rounded-3xl
                border
                border-cyan-500/10
                bg-white/[0.03]
                backdrop-blur-xl
                transition-all
                duration-500
                hover:-translate-y-2
                hover:border-cyan-500/50
                hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]
              "
            >
              <div className="absolute inset-0 bg-cyan-500/10 blur-3xl" />

              <AboutProfilePhoto />
            </div>
          </div>
          {/* Cards */}
          <div className="grid gap-5 md:grid-cols-2">
            {/* Fundador */}
            <div
              className="
                rounded-3xl
                border
                border-cyan-500/10
                bg-white/[0.03]
                p-5
                backdrop-blur-xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-cyan-500/40
                hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]
              "
            >
              <h2 className="text-xl font-semibold text-white">
                👨‍💻 Quem está por trás
              </h2>

              <p className="mt-4 leading-7 text-zinc-400">
                A ZTech Solutions é fundada por{" "}
                <span className="font-medium text-white">
                  Zenaldo Oliveira
                </span>
                , Desenvolvedor Full Stack formado em{" "}
                <span className="font-semibold text-cyan-400">
                  Análise e Desenvolvimento de Sistemas
                </span>
                , construindo aplicações modernas com React, Next.js,
                TypeScript, Prisma e PostgreSQL.
                <br />
                <br />
                Além da área de desenvolvimento, possui formação técnica em{" "}
                <span className="font-semibold text-cyan-400">
                  Eletrotécnica
                </span>{" "}
                e conhecimentos em{" "}
                <span className="font-semibold text-cyan-400">
                  Investigação Digital (OSINT)
                </span>
                — uma combinação que fortalece a resolução de problemas e o
                pensamento analítico por trás de cada solução entregue.
              </p>
            </div>

            {/* Formação */}
            <AboutFormationCard />

            {/* Áreas de Interesse */}
            <div
              className="
                md:col-span-2
                rounded-3xl
                border
                border-cyan-500/10
                bg-white/[0.03]
                p-5
                backdrop-blur-xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-cyan-500/40
                hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]
              "
            >
              <h2 className="text-xl font-semibold text-white">
                Áreas de Interesse
              </h2>

              <ul className="mt-4 grid gap-3 text-zinc-400 md:grid-cols-2">
                <li>💻 Desenvolvimento Web</li>
                <li>🤖 Inteligência Artificial</li>
                <li>⚡ Automações</li>
                <li>🔍 OSINT</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
