"use client";

import { useTranslations } from "@/lib/i18n/LanguageContext";

// Formação do fundador — informação secundária no /about: bloco discreto,
// sem card de destaque, abaixo da apresentação.
export function AboutFormationCard() {
  const t = useTranslations();
  const { formationTitle, formationItems } = t.about.founder;

  return (
    <div className="border-t border-border pt-5">
      <p className="font-mono text-[11px] uppercase tracking-wider text-text-muted">{formationTitle}</p>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-text-secondary">
        {formationItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
