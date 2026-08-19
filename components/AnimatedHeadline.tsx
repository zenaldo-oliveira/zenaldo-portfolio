"use client";

import { TypeAnimation } from "react-type-animation";
import { useReducedMotion } from "framer-motion";

type AnimatedHeadlineProps = {
  sequence: (string | number)[];
  className?: string;
};

// Isola a única parte interativa (TypeAnimation) das páginas,
// permitindo que elas voltem a ser Server Components e exportem metadata.
export function AnimatedHeadline({ sequence, className }: AnimatedHeadlineProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    const firstText = typeof sequence[0] === "string" ? sequence[0] : "";

    return <span className={className}>{firstText}</span>;
  }

  return (
    <TypeAnimation
      sequence={sequence}
      wrapper="span"
      speed={50}
      repeat={Infinity}
      className={className}
    />
  );
}
