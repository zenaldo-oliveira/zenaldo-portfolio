"use client";

import { TypeAnimation } from "react-type-animation";

type AnimatedHeadlineProps = {
  sequence: (string | number)[];
  className?: string;
};

// Isola a única parte interativa (TypeAnimation) das páginas,
// permitindo que elas voltem a ser Server Components e exportem metadata.
export function AnimatedHeadline({ sequence, className }: AnimatedHeadlineProps) {
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
