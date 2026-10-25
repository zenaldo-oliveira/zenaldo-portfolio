"use client";

import type { Price } from "@/lib/catalog/data";
import { formatPrice } from "@/lib/catalog/pricing";
import { useLanguage, useTranslations } from "@/lib/i18n/LanguageContext";
import type { LanguageCode } from "@/lib/i18n/types";

const LOCALES: Record<LanguageCode, string> = { pt: "pt-BR", en: "en-US", es: "es-ES" };

// Valor confirmado em reais no idioma do visitante; null vira o rótulo
// informado (padrão: "Sob consulta").
export function usePriceFormatter(onRequest?: string): (value: Price) => string {
  const { language } = useLanguage();
  const t = useTranslations();
  return (value) => formatPrice(value, LOCALES[language], onRequest ?? t.commercial.priceOnRequest);
}
