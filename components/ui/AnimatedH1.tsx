"use client";

import { useRef, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import VariableProximity from "@/components/variable-proximity/VariableProximity";

// Só com mouse de verdade (hover + ponteiro fino) e sem movimento reduzido.
// Em touch, movimento reduzido, no servidor e sem JavaScript o título é texto
// puro — leitura estática no celular e H1 legível no HTML para SEO.
const PROXIMITY_QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

function subscribeProximityQuery(onChange: () => void) {
  const query = window.matchMedia(PROXIMITY_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function useProximityEnabled() {
  return useSyncExternalStore(subscribeProximityQuery, () => window.matchMedia(PROXIMITY_QUERY).matches, () => false);
}

// Efeito discreto: só o peso da fonte variável do site (Geist, eixo 'wght')
// sobe perto do cursor e volta ao peso dos títulos (font-semibold = 600). Sem
// onda contínua, escala ou deslocamento, para não atrapalhar a leitura.
const REST_WEIGHT = "'wght' 600";
const NEAR_WEIGHT = "'wght' 760";
const RADIUS = 110;

type AnimatedH1Props = Omit<HTMLMotionProps<"h1">, "children"> & {
  // Texto do título (já traduzido).
  text: string;
};

// H1 com a animação VariableProximity. Classes de tamanho, cor e espaçamento
// vêm da página; props de animação do framer (ex.: entrada do Hero) e
// atributos HTML (id, aria-*) passam direto para o <h1>. O leitor de tela
// recebe o título uma única vez (letras animadas ficam aria-hidden).
export function AnimatedH1({ text, ...props }: AnimatedH1Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const isEnabled = useProximityEnabled();

  return (
    <motion.h1 ref={headingRef} {...props}>
      {isEnabled ? (
        <VariableProximity
          label={text}
          fromFontVariationSettings={REST_WEIGHT}
          toFontVariationSettings={NEAR_WEIGHT}
          containerRef={headingRef}
          radius={RADIUS}
          falloff="gaussian"
          smoothing={0.25}
        />
      ) : (
        text
      )}
    </motion.h1>
  );
}
