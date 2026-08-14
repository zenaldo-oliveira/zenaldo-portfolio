import ParticlesBackground from "@/components/ParticlesBackground";
import { AnimatedHeadline } from "@/components/AnimatedHeadline";
import { SolutionsTeaser } from "@/components/home/SolutionsTeaser";
import { CasesTeaser } from "@/components/home/CasesTeaser";
import Link from "next/link";
import { ArrowRight, Sparkles, Brain } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZTech Solutions | Desenvolvimento de Software para Empresas",
  description:
    "A ZTech Solutions desenvolve sistemas web, SaaS, automações e soluções com inteligência artificial para empresas que querem ganhar produtividade, controle e escala.",
  keywords: [
    "desenvolvimento de software",
    "sistemas empresariais",
    "SaaS",
    "automação de processos",
    "inteligência artificial para empresas",
    "Next.js",
    "React",
  ],
  alternates: {
    canonical: "/",
  },
};

const problems = [
  "Planilhas espalhadas",
  "Processos manuais",
  "Informações descentralizadas",
  "Excesso de tarefas repetitivas",
  "Sistemas que não conversam entre si",
  "Dificuldade para acompanhar operações",
  "Falta de indicadores",
  "Atendimento manual",
];

const workSteps = [
  { number: "01", title: "Entendemos o problema" },
  { number: "02", title: "Mapeamos o processo" },
  { number: "03", title: "Definimos a solução" },
  { number: "04", title: "Desenvolvemos" },
  { number: "05", title: "Testamos" },
  { number: "06", title: "Colocamos em produção" },
  { number: "07", title: "Evoluímos" },
];

const aiUseCases = [
  "Atendimento",
  "Qualificação de leads",
  "Automação",
  "Análise",
  "Suporte",
  "Produtividade",
];

const technologies = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Prisma",
  "APIs",
  "IA",
];

export default function Home() {
  return (
    <>
      {/* ========================================================== */}
      {/* HERO */}
      {/* ========================================================== */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 md:px-6">
        <ParticlesBackground />

        <div className="absolute inset-0 bg-[#020617]/80" />

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/5 px-4 py-2 text-sm text-cyan-400 backdrop-blur-md">
            <Sparkles size={16} />
            ZTech Solutions — Desenvolvimento de Software
          </span>

          <h1 className="mt-6 text-4xl font-black leading-tight text-white md:text-5xl">
            Transformamos processos empresariais em
          </h1>

          <span className="mt-2 block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent text-4xl font-black md:text-5xl">
            <AnimatedHeadline
              sequence={[
                "Sistemas Web",
                2000,
                "Sistemas Empresariais",
                2000,
                "Plataformas SaaS",
                2000,
                "Soluções com IA",
                2000,
              ]}
            />
          </span>

          <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-zinc-400 md:text-base">
            Desenvolvemos sistemas web, SaaS, automações e soluções com
            inteligência artificial para empresas que querem ganhar
            produtividade, controle e escala.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
            >
              Falar com a ZTech
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/projects"
              className="rounded-xl border border-zinc-700 px-6 py-3 text-sm text-white transition-all duration-300 hover:border-cyan-500 hover:bg-cyan-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
            >
              Ver projetos
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* PROBLEMAS QUE RESOLVEMOS */}
      {/* ========================================================== */}
      <section className="relative bg-[#020617] px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">
            Sua empresa ainda depende de processos manuais?
          </h2>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {problems.map((problem) => (
              <div
                key={problem}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm text-zinc-300"
              >
                {problem}
              </div>
            ))}
          </div>

          <p className="mt-10 text-base font-medium text-cyan-400">
            &ldquo;A tecnologia deve simplificar a operação, não
            complicá-la.&rdquo;
          </p>

          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
          >
            Quero melhorar meu processo
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ========================================================== */}
      {/* SOLUÇÕES */}
      {/* ========================================================== */}
      <section className="relative bg-[#020617] px-6 py-20">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">
            Soluções
          </h2>
          <p className="mt-3 text-sm text-zinc-400 md:text-base">
            Sistemas empresariais, SaaS, inteligência artificial, automação,
            sistemas web e integrações.
          </p>
        </div>

        <SolutionsTeaser />
      </section>

      {/* ========================================================== */}
      {/* CASES */}
      {/* ========================================================== */}
      <section className="relative bg-[#020617] px-6 py-20">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">
            Cases
          </h2>
          <p className="mt-3 text-sm text-zinc-400 md:text-base">
            Exemplos reais do que já desenvolvemos — o problema, a solução e
            a tecnologia por trás de cada um.
          </p>
        </div>

        <CasesTeaser />
      </section>

      {/* ========================================================== */}
      {/* COMO TRABALHAMOS */}
      {/* ========================================================== */}
      <section className="relative bg-[#020617] px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-black text-white md:text-4xl">
            Como trabalhamos
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {workSteps.map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4"
              >
                <span className="text-2xl font-black text-cyan-400">
                  {step.number}
                </span>
                <p className="mt-2 text-sm text-white">{step.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* IA + AUTOMAÇÃO */}
      {/* ========================================================== */}
      <section className="relative bg-[#020617] px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Brain size={32} className="mx-auto mb-4 text-cyan-400" />

          <h2 className="text-3xl font-black text-white md:text-4xl">
            Inteligência artificial aplicada ao negócio.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-400 md:text-base">
            Utilizamos IA para atendimento, qualificação de leads,
            automação, análise, suporte e produtividade — reduzindo o
            trabalho manual repetitivo da operação.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {aiUseCases.map((useCase) => (
              <span
                key={useCase}
                className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300"
              >
                {useCase}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* TECNOLOGIAS */}
      {/* ========================================================== */}
      <section className="relative bg-[#020617] px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">
            Tecnologias
          </h2>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* CTA FINAL */}
      {/* ========================================================== */}
      <section className="relative bg-[#020617] px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-black text-white md:text-4xl">
            Tem um processo que poderia ser melhor?
          </h2>

          <p className="mt-4 text-sm text-zinc-400 md:text-base">
            Conte como sua empresa trabalha hoje. Vamos entender o problema
            e avaliar como a tecnologia pode transformar esse processo.
          </p>

          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
          >
            Falar com a ZTech
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
