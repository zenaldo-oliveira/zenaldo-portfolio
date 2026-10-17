import type { ReactNode } from "react";

// Espaço visível ANTES da seção (tokens --space-section-* em globals.css):
//   compact  24 → 40px · default 40 → 64px · spacious 56 → 96px (mobile → desktop)
//   hero     abertura de página: distância própria da Top Bar.
// O espaço pertence à seção seguinte (só padding-top), então paddings
// adjacentes nunca se somam — ver .section em globals.css.
export type SectionVariant = "compact" | "default" | "spacious" | "hero";

type SectionProps = {
  id?: string;
  variant?: SectionVariant;
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
};

// Seção padrão de página: ritmo vertical por variante e respiro lateral
// consistente. O id serve de âncora (a Top Bar fixa é compensada por
// scroll-padding-top no CSS). Fundo transparente: o cenário vem do
// PageBackground global.
export function Section({ id, variant = "default", ariaLabel, children, className = "" }: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={`section section--${variant} relative px-4 sm:px-6 ${className}`}
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
  // Padrão: --space-header-gap (24 → 40px) até o conteúdo. Passar className
  // substitui esse espaçamento (ex.: "mb-0" quando o header divide a linha
  // com um link).
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className = "mb-(--space-header-gap)",
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
