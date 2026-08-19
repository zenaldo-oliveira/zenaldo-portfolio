"use client";

import ParticlesBackground from "@/components/ParticlesBackground";
import { AnimatedHeadline } from "@/components/AnimatedHeadline";
import { SolutionsTeaser } from "@/components/home/SolutionsTeaser";
import { CasesTeaser } from "@/components/home/CasesTeaser";
import Link from "next/link";
import { ArrowRight, Sparkles, Brain } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import { revealContainer, revealItem } from "@/lib/motion/variants";

// Nomes de tecnologias — não traduzidos (marcas/produtos reais).
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

export function HomeContent() {
  const t = useTranslations();
  const prefersReducedMotion = useReducedMotion();
  const headlineSequence = t.home.hero.headlineSequence.flatMap((text) => [
    text,
    2000,
  ]);

  return (
    <>
      {/* ========================================================== */}
      {/* HERO */}
      {/* ========================================================== */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 md:px-6">
        <ParticlesBackground />

        <div className="absolute inset-0 bg-background/80" />

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/5 px-4 py-2 text-sm text-accent backdrop-blur-md">
            <Sparkles size={16} />
            {t.home.hero.badge}
          </span>

          <h1 className="mt-6 text-4xl font-black leading-tight text-text-primary md:text-5xl">
            {t.home.hero.titleLine}
          </h1>

          <span className="mt-2 block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent text-4xl font-black md:text-5xl">
            <AnimatedHeadline sequence={headlineSequence} />
          </span>

          <p className="mx-auto mt-6 max-w-3xl text-sm leading-7 text-text-secondary md:text-base">
            {t.home.hero.description}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
            >
              {t.home.hero.ctaPrimary}
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/projects"
              className="rounded-xl border border-zinc-700 px-6 py-3 text-sm text-text-primary transition-all duration-300 hover:border-cyan-500 hover:bg-cyan-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
            >
              {t.home.hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* PROBLEMAS QUE RESOLVEMOS */}
      {/* ========================================================== */}
      <section className="relative bg-background px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-black text-text-primary md:text-4xl">
            {t.home.problems.title}
          </h2>

          <motion.div
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={revealContainer}
            className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {t.home.problems.items.map((problem) => (
              <motion.div
                key={problem}
                variants={revealItem}
                className="rounded-3xl border border-border bg-surface px-4 py-3 text-sm text-text-secondary backdrop-blur-xl"
              >
                {problem}
              </motion.div>
            ))}
          </motion.div>

          <p className="mt-10 text-base font-medium text-accent">
            &ldquo;{t.home.problems.quote}&rdquo;
          </p>

          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
          >
            {t.home.problems.cta}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ========================================================== */}
      {/* SOLUÇÕES */}
      {/* ========================================================== */}
      <section className="relative bg-background px-6 py-20">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="text-3xl font-black text-text-primary md:text-4xl">
            {t.home.solutions.title}
          </h2>
          <p className="mt-3 text-sm text-text-secondary md:text-base">
            {t.home.solutions.description}
          </p>
        </div>

        <SolutionsTeaser />
      </section>

      {/* ========================================================== */}
      {/* CASES */}
      {/* ========================================================== */}
      <section className="relative bg-background px-6 py-20">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="text-3xl font-black text-text-primary md:text-4xl">
            {t.home.cases.title}
          </h2>
          <p className="mt-3 text-sm text-text-secondary md:text-base">
            {t.home.cases.description}
          </p>
        </div>

        <CasesTeaser />
      </section>

      {/* ========================================================== */}
      {/* COMO TRABALHAMOS */}
      {/* ========================================================== */}
      <section className="relative bg-background px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-black text-text-primary md:text-4xl">
            {t.home.howWeWork.title}
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.home.howWeWork.steps.map((step, index) => (
              <div
                key={step}
                className="rounded-3xl border border-border bg-surface p-4 backdrop-blur-xl"
              >
                <span className="text-2xl font-black text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 text-sm text-text-primary">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================== */}
      {/* IA + AUTOMAÇÃO */}
      {/* ========================================================== */}
      <section className="relative bg-background px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <Brain size={32} className="mx-auto mb-4 text-accent" />

          <h2 className="text-3xl font-black text-text-primary md:text-4xl">
            {t.home.ai.title}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-text-secondary md:text-base">
            {t.home.ai.description}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {t.home.ai.useCases.map((useCase) => (
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
      <section className="relative bg-background px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-black text-text-primary md:text-4xl">
            {t.home.technologies.title}
          </h2>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-text-secondary"
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
      <section className="relative bg-background px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-black text-text-primary md:text-4xl">
            {t.home.finalCta.title}
          </h2>

          <p className="mt-4 text-sm text-text-secondary md:text-base">
            {t.home.finalCta.description}
          </p>

          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
          >
            {t.home.finalCta.cta}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
