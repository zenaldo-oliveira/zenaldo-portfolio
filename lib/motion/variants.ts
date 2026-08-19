import type { Variants } from "framer-motion";

// Reveal padrão para grids de cards: fade + translateY pequeno, com stagger
// discreto entre itens. Usado via whileInView (dispara uma vez ao entrar na
// viewport). Sempre combinar com initial={prefersReducedMotion ? false : "hidden"}
// no elemento — nunca aplicar "hidden" quando o usuário pede menos movimento.
export const revealContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Para uma seção única (não uma lista de itens) — mesmo fade+translateY,
// sem stagger.
export const revealSection: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};
