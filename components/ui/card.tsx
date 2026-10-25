import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// Card com a API do shadcn/ui (Card, CardHeader, CardTitle, CardDescription,
// CardContent, CardFooter, data-slot) sobre os tokens do site. O projeto não
// tem o shadcn instalado (sem components.json/Radix); estes componentes seguem
// a mesma API para que uma instalação futura seja troca direta.

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn("flex flex-col overflow-hidden rounded-xl border border-border bg-surface text-text-primary", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("flex flex-col gap-1.5 px-5 pt-5", className)} {...props} />;
}

// `as`: nível do título conforme a hierarquia da página (padrão h3).
export function CardTitle({ className, as: Heading = "h3", ...props }: ComponentProps<"h3"> & { as?: "h2" | "h3" | "h4" }) {
  return <Heading data-slot="card-title" className={cn("text-lg font-semibold leading-snug tracking-tight", className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p data-slot="card-description" className={cn("text-sm leading-relaxed text-text-secondary", className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("px-5", className)} {...props} />;
}

export function CardFooter({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-footer" className={cn("mt-auto flex items-center px-5 pb-5", className)} {...props} />;
}
