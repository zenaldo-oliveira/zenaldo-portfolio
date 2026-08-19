"use client";

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
import { useTranslations } from "@/lib/i18n/LanguageContext";

const icons = [Building2, Layers3, Brain, Workflow, Code2, Plug];

export function ServicesContent() {
  const t = useTranslations();
  const headlineSequence = t.services.headlineSequence.flatMap((text) => [
    text,
    2000,
  ]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-background px-6 py-6">
      <div className="absolute inset-0 bg-background" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#06b6d420,transparent_50%)]" />

      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[150px]" />

      <div
        className="
          absolute inset-0
          opacity-[0.03]
          bg-[linear-gradient(to_right,rgba(255,255,255,0.15)_1px,transparent_1px),
          linear-gradient(to_bottom,rgba(255,255,255,0.15)_1px,transparent_1px)]
          bg-[size:60px_60px]
        "
      />

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
        <span
          className="
            mb-6 flex items-center gap-2
            rounded-full
            border border-cyan-500/20
            bg-cyan-500/10
            px-4 py-2
            text-sm font-medium
            text-accent
          "
        >
          <Sparkles size={16} />
          {t.services.badge}
        </span>

        <h1 className="mb-4 min-h-[70px] text-center text-4xl font-black md:min-h-[80px] md:text-5xl">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 bg-clip-text text-transparent">
            <AnimatedHeadline sequence={headlineSequence} />
          </span>
        </h1>

        <p className="mb-8 max-w-2xl text-center text-sm text-text-secondary md:text-base">
          {t.services.description}
        </p>

        <div className="grid w-full max-w-6xl gap-4 md:grid-cols-2 xl:grid-cols-3">
          {t.services.items.map((service, index) => {
            const Icon = icons[index];

            return (
              <div
                key={service.title}
                className="group rounded-3xl border border-border bg-surface p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/40"
              >
                <Icon
                  size={32}
                  className="mb-4 text-accent transition-transform duration-300 group-hover:scale-110"
                />

                <h2 className="mb-3 text-xl font-semibold text-text-primary">
                  {service.title}
                </h2>

                <p className="text-sm text-text-secondary">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <h2 className="text-2xl font-bold text-text-primary">
            {t.services.ctaTitle}
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
              {t.services.ctaContact}
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/projects"
              className="
        rounded-xl
        border
        border-border
        bg-surface
        px-6 py-3
        font-semibold
        text-text-primary
        transition-all
        duration-300
        hover:bg-white/10
        hover:border-cyan-500/30
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60
      "
            >
              {t.services.ctaProjects}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
