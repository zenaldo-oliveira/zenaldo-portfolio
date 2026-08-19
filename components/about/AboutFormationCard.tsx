"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "@/lib/i18n/LanguageContext";

export function AboutFormationCard() {
  const prefersReducedMotion = useReducedMotion();
  const t = useTranslations();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
      viewport={{ once: true }}
      className="
              rounded-3xl
              border
              border-cyan-500/10
              bg-surface
              p-5
            "
    >
      <h2 className="text-xl font-semibold text-text-primary">
        {t.about.formationTitle}
      </h2>

      <ul className="mt-4 space-y-2 text-text-secondary">
        {t.about.formationItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </motion.div>
  );
}
