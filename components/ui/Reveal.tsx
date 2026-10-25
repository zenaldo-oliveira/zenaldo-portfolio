"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

// Entradas ao rolar SÓ por deslocamento: o conteúdo nunca nasce oculto
// (sem opacity: 0), então continua visível sem JavaScript, na impressão,
// em capturas de página inteira e quando o visitante salta direto para
// uma âncora ou para o fim. Com movimento reduzido (ou na impressão), o
// CSS anula o deslocamento dos elementos marcados com data-reveal
// (globals.css) e a MotionConfig global torna a transição instantânea.
const EASE = [0.16, 1, 0.3, 1] as const;

// Dispara assim que o bloco entra na tela (sem margem negativa).
const VIEWPORT = { once: true, amount: "some" } as const;

type RevealCustom = { delay: number; distance: number };

const variants: Variants = {
  hidden: ({ distance }: RevealCustom) => ({ y: distance }),
  visible: ({ delay }: RevealCustom) => ({
    y: 0,
    transition: { duration: 0.6, ease: EASE, delay },
  }),
};

type RevealProps = {
  children: ReactNode;
  className?: string;
  // Atraso em segundos — para escalonar elementos vizinhos.
  delay?: number;
  // Deslocamento vertical da entrada, em px (padrão 16).
  distance?: number;
};

const staggerItem: Variants = {
  hidden: { y: 24, scale: 0.98 },
  visible: { y: 0, scale: 1, transition: { duration: 0.65, ease: EASE } },
};

type RevealStaggerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol";
  // Intervalo entre os itens, em segundos.
  stagger?: number;
};

// Grupo que entra em sequência ao rolar (uma vez): cada RevealItem sobe
// alguns pixels, um depois do outro — usado em grades de cards.
export function RevealStagger({ children, className, as = "div", stagger = 0.09 }: RevealStaggerProps) {
  const Component = motion[as];

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } } }}
      className={className}
    >
      {children}
    </Component>
  );
}

export function RevealItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "li" }) {
  const Component = motion[as];
  return (
    <Component data-reveal="" variants={staggerItem} className={className}>
      {children}
    </Component>
  );
}

// Entrada suave (16px por padrão) quando o bloco entra na tela, uma única vez.
export function Reveal({ children, className, delay = 0, distance = 16 }: RevealProps) {
  const custom: RevealCustom = { delay, distance };

  return (
    <motion.div
      data-reveal=""
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={variants}
      custom={custom}
      className={className}
    >
      {children}
    </motion.div>
  );
}
