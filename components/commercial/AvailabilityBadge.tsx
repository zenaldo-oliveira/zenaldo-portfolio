"use client";

import type { Availability } from "@/lib/catalog/data";
import { useTranslations } from "@/lib/i18n/LanguageContext";

// Selo "Disponível" (escopo padrão, por plano) ou "Sob medida" (exige
// diagnóstico e escopo). Forma + texto: não depende só da cor.
export function AvailabilityBadge({ availability }: { availability: Availability }) {
  const t = useTranslations();
  const isAvailable = availability === "available";

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
        isAvailable ? "border-border-accent bg-accent/10 text-accent" : "border-border-strong text-text-secondary"
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 ${isAvailable ? "rounded-full bg-accent" : "rotate-45 border border-text-secondary"}`}
      />
      {t.commercial.availability[availability].label}
    </span>
  );
}
