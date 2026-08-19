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
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import { revealContainer, revealItem } from "@/lib/motion/variants";

const icons = [Building2, Layers3, Brain, Workflow, Code2, Plug];

export function SolutionsTeaser() {
  const t = useTranslations();
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="mx-auto w-full max-w-5xl">
      <motion.div
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={revealContainer}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {t.home.solutions.items.map((title, index) => {
          const Icon = icons[index];

          return (
            <motion.div
              key={title}
              variants={revealItem}
              className="group flex items-center gap-3 rounded-3xl border border-border bg-surface p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40"
            >
              <Icon
                size={22}
                className="shrink-0 text-accent transition-transform group-hover:scale-110"
              />
              <span className="text-sm font-medium text-text-primary">
                {title}
              </span>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/services"
          className="flex items-center gap-2 rounded-lg text-sm font-medium text-accent transition-colors hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
        >
          {t.home.solutions.viewAll}
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
