import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { buildWhatsAppUrl } from "@/lib/contact/whatsapp";

type WhatsAppCtaProps = {
  label: string;
  // Mensagem pré-preenchida; sem ela, usa a mensagem padrão do site.
  message?: string;
  ariaLabel?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
  showArrow?: boolean;
  className?: string;
  onClick?: () => void;
};

// CTA principal do site: abre o WhatsApp da ZTech em nova aba.
export function WhatsAppCta({
  label,
  message,
  ariaLabel,
  variant = "primary",
  size = "md",
  showArrow = true,
  className,
  onClick,
}: WhatsAppCtaProps) {
  return (
    <Button
      href={buildWhatsAppUrl(message)}
      external
      variant={variant}
      size={size}
      className={className}
      ariaLabel={ariaLabel}
      onClick={onClick}
    >
      {label}
      {showArrow && (
        <ArrowRight
          size={16}
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
        />
      )}
    </Button>
  );
}
