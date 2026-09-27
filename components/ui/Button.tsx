import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "link";
type ButtonSize = "sm" | "md";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  // Links externos (ex.: WhatsApp) abrem em nova aba com rel seguro.
  external?: boolean;
  className?: string;
  ariaLabel?: string;
  onClick?: () => void;
};

const BASE =
  "group inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-cta text-white hover:bg-cta-hover",
  secondary:
    "border border-border bg-surface text-text-primary hover:border-border-strong hover:bg-surface-strong",
  link: "rounded-md text-accent hover:text-text-primary",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-5 text-sm",
};

// Botão-link padrão do site (CTAs são sempre navegação, nunca ações de
// formulário). A variante "link" não recebe padding.
export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  external = false,
  className = "",
  ariaLabel,
  onClick,
}: ButtonProps) {
  const classes = [
    BASE,
    VARIANTS[variant],
    variant === "link" ? "" : SIZES[size],
    className,
  ].join(" ");

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        onClick={onClick}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={classes}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
}
