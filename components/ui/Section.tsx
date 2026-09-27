import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  children: ReactNode;
  className?: string;
};

// Seção padrão de página: espaçamento vertical e lateral consistente. O id
// serve de âncora (a Top Bar fixa é compensada por scroll-padding-top no
// CSS). Fundo transparente: o cenário vem do PageBackground global.
export function Section({ id, children, className = "" }: SectionProps) {
  return (
    <section
      id={id}
      className={`relative px-4 py-20 sm:px-6 lg:py-28 ${className}`}
    >
      {children}
    </section>
  );
}

type SectionHeaderProps = {
  // Rótulo curto em fonte mono acima do título (ex.: "Soluções").
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  // Padrão "mb-12"; passar className substitui o espaçamento inferior.
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className = "mb-12",
}: SectionHeaderProps) {
  const alignment = align === "center" ? "mx-auto text-center" : "";

  return (
    <div className={`max-w-2xl ${alignment} ${className}`}>
      {eyebrow && (
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="mt-4 text-pretty text-base leading-relaxed text-text-secondary">
          {description}
        </p>
      )}
    </div>
  );
}
