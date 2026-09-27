"use client";

import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/contact/whatsapp";
import { useTranslations } from "@/lib/i18n/LanguageContext";

// Atalho fixo para o WhatsApp (número e mensagem vêm de lib/contact/whatsapp).
// z-30: abaixo do overlay do drawer mobile (z-40) — com o menu aberto, o botão
// não pode ficar clicável por cima do painel.
export function FloatingWhatsapp() {
  const t = useTranslations();

  return (
    <a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.cta.whatsappAriaLabel}
      className="
        fixed
        bottom-[calc(1.5rem+env(safe-area-inset-bottom))]
        right-6
        z-30
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-full
        bg-[#25D366]
        text-white
        shadow-lg
        transition-transform
        duration-200
        hover:scale-105
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-ring
        focus-visible:ring-offset-2
        focus-visible:ring-offset-background
        motion-reduce:transition-none
      "
    >
      <MessageCircle size={26} strokeWidth={2.5} aria-hidden="true" />
    </a>
  );
}
