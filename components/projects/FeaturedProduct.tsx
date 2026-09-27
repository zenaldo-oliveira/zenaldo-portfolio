"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { ZLiftMockup } from "@/components/home/ZLiftMockup";
import { Reveal } from "@/components/ui/Reveal";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import { PROJECTS } from "@/lib/projects/data";

const ZLIFT_INDEX = 0; // posição do ZLift em PROJECTS / t.projects.items

type FeaturedProductProps = {
  // Ações opcionais abaixo do texto (ex.: CTAs em /projects).
  actions?: ReactNode;
};

// Destaque do ZLift Manager (produto próprio). Usa a screenshot real quando
// existir em PROJECTS[0].image; até lá, o mockup conceitual. Textos do case
// real (t.projects.items) — usado em /about e /projects.
export function FeaturedProduct({ actions }: FeaturedProductProps) {
  const t = useTranslations();
  const zlift = PROJECTS[ZLIFT_INDEX];
  const copy = t.projects.items[ZLIFT_INDEX];

  return (
    <Reveal>
      <article className="grid overflow-hidden rounded-3xl border border-border bg-surface/70 xl:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col border-b border-border p-6 sm:p-10 xl:border-b-0 xl:border-r">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">{copy.status}</p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">{zlift.title}</h3>
          <p className="mt-1 text-sm text-text-secondary">{t.home.product.tagline}</p>
          <p className="mt-6 text-sm leading-relaxed text-text-secondary">{copy.solution}</p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-text-muted">{copy.category}</p>
          {actions && <div className="mt-8">{actions}</div>}
        </div>

        <div className="flex items-center justify-center px-6 pb-16 pt-14 sm:px-12">
          {zlift.image ? (
            <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl border border-border-strong">
              <Image src={zlift.image} alt={zlift.title} fill sizes="(min-width: 1280px) 560px, 90vw" className="object-cover" />
            </div>
          ) : (
            <ZLiftMockup />
          )}
        </div>
      </article>
    </Reveal>
  );
}
