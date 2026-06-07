export default function ParticlesBackground() {
  return (
    <>
      {/* Fundo principal */}
      <div className="absolute inset-0 bg-[#020617]" />

      {/* Gradiente superior */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#06b6d420,transparent_50%)]" />

      {/* Glow central */}
      <div
        className="
    absolute
    left-1/2
    top-1/2
    h-[500px]
    w-[500px]
    -translate-x-1/2
    -translate-y-1/2
    rounded-full
    bg-cyan-500/10
    blur-[150px]
    animate-pulse
  "
      />

      {/* Glow esquerda */}
      <div className="absolute left-0 top-1/3 h-[250px] w-[250px] rounded-full bg-cyan-500/10 blur-[120px]" />

      {/* Glow direita */}
      <div className="absolute bottom-1/3 right-0 h-[250px] w-[250px] rounded-full bg-blue-500/10 blur-[120px]" />

      {/* Grid tecnológica */}
      <div
        className="
          absolute inset-0 opacity-[0.03]
          bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),
          linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)]
          bg-[size:50px_50px]
        "
      />
      <div
        className="
    absolute
    top-0
    left-1/2
    h-[600px]
    w-[800px]
    -translate-x-1/2
    bg-cyan-500/10
    blur-[180px]
  "
      />

      {/* Vinheta */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,#0341fe_100%)]" />
    </>
  );
}
