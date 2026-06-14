"use client";

import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import Image from "next/image";

export default function AboutPage() {
  return (
    <section className="relative min-h-screen overflow-hidden px-6 py-10">
      {/* Background SaaS */}

      <div className="absolute inset-0 bg-gradient-to-br from-[#020617] via-[#0a1f52] to-[#020617]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#06b6d420,transparent_50%)]" />

      <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[150px]" />

      <div
        className="
          absolute inset-0 opacity-[0.05]
          bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),
          linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)]
          bg-[size:40px_40px]
        "
      />

      {/* Conteúdo */}
      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Cabeçalho */}
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center">
          <span
            className="
            inline-flex items-center gap-2
            rounded-full
            border border-cyan-500/20
            bg-cyan-500/10
            px-4 py-2
            text-sm font-medium
            text-cyan-400
          "
          >
            🚀 Sobre Mim
          </span>

          {/* Título */}
          <h1 className="mt-6 min-h-[90px] text-center text-3xl font-black text-white md:min-h-[110px] md:text-5xl">
            Conheça minha{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-300 bg-clip-text text-transparent">
              <TypeAnimation
                sequence={[
                  "trajetória na tecnologia",
                  2000,
                  "evolução profissional",
                  2000,
                  "paixão por desenvolvimento",
                  2000,
                  "busca por conhecimento",
                  2000,
                ]}
                speed={50}
                repeat={Infinity}
              />
            </span>
          </h1>

          {/* Descrição */}
          <p className="mx-auto mt-4 max-w-3xl text-center text-base leading-7 text-zinc-400">
            Desenvolvedor Full Stack formado em{" "}
            <span className="font-semibold text-cyan-400">
              Análise e Desenvolvimento de Sistemas
            </span>
            , construindo aplicações modernas com{" "}
            <span className="font-medium text-white">
              React, Next.js, TypeScript, Prisma e PostgreSQL.
            </span>
            <br />
            <br />
            Além da área de desenvolvimento, possuo formação técnica em{" "}
            <span className="font-semibold text-cyan-400">Eletrotécnica</span> e
            conhecimentos em{" "}
            <span className="font-semibold text-cyan-400">
              Investigação Digital (OSINT)
            </span>
            .
            <br />
            <br />
            Essa combinação de experiências fortalece minha capacidade de{" "}
            <span className="font-medium text-white">
              resolução de problemas
            </span>
            , pensamento analítico e desenvolvimento de{" "}
            <span className="font-medium text-white">
              soluções tecnológicas eficientes
            </span>
            .
          </p>
        </div>
        {/* Foto + Cards */}
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Foto */}
          <div className="flex justify-center">
            <div
              className="
                relative
                h-[320px]
                md:h-[400px]
                w-full
                max-w-[380px]
                perspective-[1000px]
                overflow-hidden
                rounded-3xl
                border
                border-cyan-500/10
                bg-white/[0.03]
                backdrop-blur-xl
                transition-all
                duration-500
                hover:-translate-y-2
                hover:border-cyan-500/50
                hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]
              "
            >
              <div className="absolute inset-0 bg-cyan-500/10 blur-3xl" />

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
                relative
                h-full
                w-full
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
            </div>
          </div>
          {/* Cards */}
          <div className="grid gap-5 md:grid-cols-2">
            {/* Quem Sou */}
            <div
              className="
                rounded-3xl
                border
                border-cyan-500/10
                bg-white/[0.03]
                p-5
                backdrop-blur-xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-cyan-500/40
                hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]
              "
            >
              <h2 className="text-xl font-semibold text-white">Quem Sou</h2>

              <p className="mt-4 leading-7 text-zinc-400">
                Sou Desenvolvedor Full Stack focado em aplicações web modernas
                utilizando React, Next.js, TypeScript e Node.js.
              </p>
            </div>

            {/* Formação */}
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

            {/* Áreas de Interesse */}
            <div
              className="
                md:col-span-2
                rounded-3xl
                border
                border-cyan-500/10
                bg-white/[0.03]
                p-5
                backdrop-blur-xl
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-cyan-500/40
                hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]
              "
            >
              <h2 className="text-xl font-semibold text-white">
                Áreas de Interesse
              </h2>

              <ul className="mt-4 grid gap-3 text-zinc-400 md:grid-cols-2">
                <li>💻 Desenvolvimento Web</li>
                <li>🤖 Inteligência Artificial</li>
                <li>⚡ Automações</li>
                <li>🔍 OSINT</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
