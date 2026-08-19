"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function AboutProfilePhoto() {
  return (
    <motion.div
      animate={{
        y: [0, -15, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      whileHover={{
        scale: 1.08,
        rotateY: 12,
        rotateX: 8,
      }}
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
