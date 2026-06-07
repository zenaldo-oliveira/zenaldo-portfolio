<div
  className="
    rounded-3xl
    border border-white/10
    bg-white/[0.03]
    p-6
    backdrop-blur-xl
  "
>
  <h2 className="mb-4 text-center text-2xl font-bold text-white">
    💻 Tecnologias
  </h2>

  <p className="mb-8 text-center text-zinc-400">
    Tecnologias que utilizo no desenvolvimento de aplicações modernas.
  </p>

  <div className="flex flex-wrap justify-center gap-3">
    {[
      "HTML5",
      "CSS3",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind",
      "Node.js",
      "Prisma",
      "PostgreSQL",
      "Git",
      "GitHub",
      "IA",
      "Automações",
    ].map((tech) => (
      <span
        key={tech}
        className="
          cursor-pointer
          rounded-full
          border border-cyan-500/20
          bg-cyan-500/10
          px-4 py-2
          text-sm
          text-cyan-300
          transition-all
          duration-300
          hover:-translate-y-1
          hover:scale-105
          hover:border-cyan-500/50
          hover:bg-cyan-500/20
        "
      >
        {tech}
      </span>
    ))}
  </div>
</div>;
