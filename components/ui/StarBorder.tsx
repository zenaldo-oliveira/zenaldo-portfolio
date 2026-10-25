import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

type StarBorderProps = {
  href: string;
  children: ReactNode;
  className?: string;
  // Duração de uma passada do brilho (CSS time).
  speed?: string;
};

// StarBorder (inspirado no componente do React Bits): botão principal com
// um brilho que percorre as bordas superior e inferior. Só para a ação
// comercial principal de cada bloco — um por tela. A cor vem do token
// --star-border-color (tema claro e escuro); com movimento reduzido o
// brilho some e fica o botão comum. O foco é o do próprio link.
export function StarBorder({ href, children, className = "", speed = "6s" }: StarBorderProps) {
  return (
    <Link
      href={href}
      style={{ "--star-border-speed": speed } as CSSProperties}
      className={`star-border group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className}`}
    >
      <span aria-hidden="true" className="star-border__glow star-border__glow--bottom" />
      <span aria-hidden="true" className="star-border__glow star-border__glow--top" />
      <span className="star-border__inner inline-flex h-10 w-full items-center justify-center gap-2 rounded-[0.45rem] bg-cta px-5 text-sm font-medium text-white transition-[background-color,transform] duration-150 group-hover:bg-cta-hover group-active:scale-[0.98] motion-reduce:group-active:scale-100">
        {children}
      </span>
    </Link>
  );
}
