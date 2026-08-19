"use client";

import Link from "next/link";
import { ArrowRight, Code2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import { revealContainer, revealItem } from "@/lib/motion/variants";

// Nomes dos projetos — não traduzidos (nomes próprios).
const caseTitles = ["🛗 ZLift Manager", "🥗 Dieta IA", "🐾 Pet Shop Premium"];

export function CasesTeaser() {
  const t = useTranslations();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="mx-auto w-full max-w-6xl">
      <motion.div
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={revealContainer}
        className="grid gap-4 md:grid-cols-3"
      >
        {t.home.cases.items.map((item, index) => (
          <motion.div
            key={caseTitles[index]}
            variants={revealItem}
            className="flex flex-col rounded-3xl border border-border bg-surface p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40"
          >
            <Code2 size={22} className="mb-3 text-accent" />

            <span className="w-fit rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
              {item.category}
            </span>

            <h3 className="mt-3 text-lg font-bold text-text-primary">
              {caseTitles[index]}
            </h3>

            <p className="mt-2 text-sm text-text-secondary">
              {item.description}
            </p>

            <span className="mt-4 text-xs text-text-secondary">
              {item.status}
            </span>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/projects"
          className="flex items-center gap-2 rounded-lg text-sm font-medium text-accent transition-colors hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
        >
          {t.home.cases.viewAll}
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
