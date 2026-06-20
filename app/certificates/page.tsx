"use client";

/* ==========================================================
   IMPORTAÇÕES
========================================================== */

import { TypeAnimation } from "react-type-animation";
import { Award, GraduationCap, Sparkles } from "lucide-react";

/* ==========================================================
   CERTIFICADOS E FORMAÇÕES
========================================================== */

const certificates = [
  {
    title: "Análise e Desenvolvimento de Sistemas",
    institution: "Graduação",
    status: "Concluído",
    year: "2025",
  },

  {
    title: "Formação Full Stack",
    institution: "Especialização",
    status: "Em andamento",
    year: "2026",
  },

  {
    title: "React",
    institution: "Certificação",
    status: "Em breve",
    year: "-",
  },

  {
    title: "Next.js",
    institution: "Certificação",
    status: "Em breve",
    year: "-",
  },

  {
    title: "TypeScript",
    institution: "Certificação",
    status: "Em breve",
    year: "-",
  },

  {
    title: "IA & Automação",
    institution: "Certificação",
    status: "Em breve",
    year: "-",
  },
];

export default function CertificatesPage() {
  return (
    <section className="relative min-h-screen overflow-x-hidden bg-[#020617] px-6 py-4">
      {/* ==========================================================
          BACKGROUND
      ========================================================== */}

      <div className="absolute inset-0 bg-[#020617]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#06b6d420,transparent_50%)]" />

      <div className="absolute left-1/2 top-1/2 h-[250px] w-[250px] md:h-[450px] md:w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

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

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ==========================================================
            BADGE
        ========================================================== */}

        <div className="flex justify-center">
          <span
            className="
              inline-flex items-center gap-2
              rounded-full
              border border-cyan-500/20
              bg-cyan-500/10
              px-4 py-2
              text-sm
              text-cyan-400
            "
          >
            <Sparkles size={16} />
            Certificados
          </span>
        </div>

        {/* ==========================================================
            TÍTULO PRINCIPAL
        ========================================================== */}

        <div className="mt-8 text-center">
          <h1 className="min-h-[60px] text-3xl font-black md:text-5xl">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 bg-clip-text text-transparent">
              <TypeAnimation
                sequence={[
                  "Formação e Certificações",
                  2000,
                  "Aprendizado Contínuo",
                  2000,
                  "Evoluindo na Tecnologia",
                  2000,
                  "Construindo Conhecimento",
                  2000,
                ]}
                speed={50}
                repeat={Infinity}
              />
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Minha jornada de aprendizado através da graduação, especializações e
            certificações na área de tecnologia.
          </p>
        </div>

        {/* ==========================================================
            FORMAÇÃO ACADÊMICA
        ========================================================== */}

        <div
          className="
            mx-auto
            mt-6
            max-w-4xl
            rounded-3xl
            border
            border-cyan-500/10
            bg-white/[0.03]
            p-6
            backdrop-blur-xl
          "
        >
          <div className="flex items-center gap-4">
            <GraduationCap size={36} className="text-cyan-400" />

            <div>
              <h2 className="font-semibold text-white">Formação Acadêmica</h2>

              <p className="text-sm text-zinc-400">
                Graduado em Análise e Desenvolvimento de Sistemas.
              </p>
            </div>
          </div>
        </div>

        {/* ==========================================================
            GRID DE CERTIFICADOS
        ========================================================== */}

        <div className="mt-6">
          <h2 className="mb-6 text-center text-2xl font-bold text-white">
            Certificados e Cursos
          </h2>

          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            {certificates.map((certificate) => (
              /* ==========================================================
                  CARD DE CERTIFICADO
              ========================================================== */
              <div
                key={certificate.title}
                className="
                  group
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  p-5
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:-translate-y-2
                  hover:border-cyan-500/40
                  hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]
                "
              >
                <Award
                  size={28}
                  className="
                    mb-4
                    text-cyan-400
                    transition-transform
                    group-hover:scale-110
                  "
                />

                <h3 className="font-semibold text-white">
                  {certificate.title}
                </h3>

                <p className="mt-2 text-sm text-zinc-400">
                  {certificate.institution}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <span
                    className="
                      rounded-full
                      border
                      border-cyan-500/20
                      bg-cyan-500/10
                      px-3
                      py-1
                      text-xs
                      text-cyan-300
                    "
                  >
                    {certificate.status}
                  </span>

                  <span className="text-xs text-zinc-500">
                    {certificate.year}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ==========================================================
            ATUALMENTE ESTUDANDO
        ========================================================== */}

        <div className="mt-6 text-center">
          <h2 className="mb-5 text-2xl font-bold text-white">
            🚀 Atualmente Estudando
          </h2>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              "React Native",
              "Next.js",
              "Prisma",
              "PostgreSQL",
              "IA",
              "Agentes IA",
              "WhatsApp Automation",
              "OSINT",
              "Docker",
            ].map((item) => (
              <span
                key={item}
                className="
                  rounded-2xl
                  border
                  border-cyan-500/20
                  bg-cyan-500/10
                  px-4
                  py-2
                  text-sm
                  text-cyan-300
                "
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
