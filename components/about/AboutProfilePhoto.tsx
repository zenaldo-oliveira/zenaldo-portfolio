"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

export function AboutProfilePhoto() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      animate={prefersReducedMotion ? undefined : { y: [0, -15, 0] }}
      transition={
        prefersReducedMotion
          ? undefined
          : { duration: 4, repeat: Infinity, ease: "easeInOut" }
      }
      whileHover={
        prefersReducedMotion
          ? undefined
          : { scale: 1.08, rotateY: 12, rotateX: 8 }
      }
      // Interação discreta baseada em entrada na viewport — cobre o mobile,
      // que não tem hover. Dispara uma vez, independente da flutuação
      // contínua acima (propriedades diferentes, não conflitam).
      whileInView={
        prefersReducedMotion
          ? undefined
          : { scale: [1, 1.04, 1], transition: { duration: 1.1, ease: "easeOut" } }
      }
      viewport={{ once: true, margin: "-40px" }}
      style={{
        transformStyle: "preserve-3d",
      }}
      className="
                absolute
                -inset-y-6
                inset-x-0
                transition-all
                duration-500
                hover:drop-shadow-[0_0_40px_rgba(34,211,238,0.7)]
              "
    >
      <Image
        src="/projects/profile.jpeg"
        alt="Zenaldo Oliveira"
        fill
        style={{
          objectPosition: "center 15%",
        }}
        className="
                  object-cover
                  rounded-3xl
                  border-2
                  border-cyan-500/30
                  shadow-[0_0_25px_rgba(34,211,238,0.4)]
                "
      />
    </motion.div>
  );
}
