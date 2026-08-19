"use client";

import { AboutProfilePhoto } from "@/components/about/AboutProfilePhoto";
import { AboutFormationCard } from "@/components/about/AboutFormationCard";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import { revealSection } from "@/lib/motion/variants";

export function AboutContent() {
  const t = useTranslations();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-screen overflow-hidden px-6 py-10">
      {/* Background SaaS */}

      <div className="absolute inset-0 bg-gradient-to-br from-background via-[#0a1f52] to-background" />

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
            text-white
          "
          >
            {t.about.badge}
          </span>

          {/* Título */}
          <h1 className="mt-6 text-center text-3xl font-black text-text-primary md:text-5xl">
            {t.about.title}
          </h1>

          {/* Descrição institucional */}
          <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-7 text-text-secondary">
            {t.about.description}
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
                bg-surface
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
          {/* Cards — coluna única: o card "Fundador" tem texto longo e, dentro
              de um grid de 2 colunas aninhado num container max-w-6xl, ficava
              permanentemente espremido (~226px) em qualquer tamanho de tela. */}
          <div className="grid gap-5">
            {/* Fundador */}
            <motion.div
              initial={prefersReducedMotion ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={revealSection}
              className="
                rounded-3xl
                border
                border-cyan-500/10
                bg-surface
                p-5
                backdrop-blur-xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-cyan-500/40
                hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]
              "
            >
              <h2 className="text-xl font-semibold text-text-primary">
                {t.about.founderTitle}
              </h2>

              <p className="mt-4 leading-7 text-text-secondary">
                {t.about.founderBody}
              </p>
            </motion.div>

            {/* Formação */}
            <AboutFormationCard />

            {/* Áreas de Interesse */}
            <motion.div
              initial={prefersReducedMotion ? false : "hidden"}
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={revealSection}
              className="
                rounded-3xl
                border
                border-cyan-500/10
                bg-surface
                p-5
                backdrop-blur-xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-cyan-500/40
                hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]
              "
            >
              <h2 className="text-xl font-semibold text-text-primary">
                {t.about.interestsTitle}
              </h2>

              <ul className="mt-4 grid gap-3 text-text-secondary md:grid-cols-2">
                {t.about.interests.map((interest) => (
                  <li key={interest}>{interest}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
