"use client";

import { motion } from "framer-motion";

export function AboutFormationCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="
              rounded-3xl
              border
              border-cyan-500/10
              bg-white/[0.03]
              p-5
            "
    >
      <h2 className="text-xl font-semibold text-white">Formação</h2>

      <ul className="mt-4 space-y-2 text-zinc-400">
        <li>🎓 Análise e Desenvolvimento de Sistemas</li>
        <li>📚 React e Next.js</li>
      </ul>
    </motion.div>
  );
}
