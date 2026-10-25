import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Badge com a API do shadcn/ui (variant: default | secondary | outline),
// sobre os tokens do site — ver components/ui/card.tsx.
type BadgeVariant = "default" | "secondary" | "outline";

const VARIANTS: Record<BadgeVariant, string> = {
  // Tema claro: accent-strong mantém ≥ 4.5:1 sobre o fundo translúcido.
  default: "border-border-accent bg-accent/10 text-accent [[data-theme=light]_&]:text-accent-strong",
  secondary: "border-transparent bg-surface-strong text-text-secondary",
  outline: "border-border-strong text-text-secondary",
};

export function Badge({ className, variant = "default", ...props }: ComponentProps<"span"> & { variant?: BadgeVariant }) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex w-fit shrink-0 items-center gap-1 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium",
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  );
}
