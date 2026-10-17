"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import type { Project } from "@/lib/projects/data";

type ProjectMediaProps = {
  project: Project;
  category: string;
};

// Largura real da área de mídia: o card ocupa a fatia do slide do
// carrossel (88% no mobile → ~32% no 2xl, dentro do Container).
const CARD_SIZES = "(min-width: 1536px) 400px, (min-width: 1280px) 420px, (min-width: 768px) 50vw, 88vw";

// Telas de celular: cada uma ocupa ~1/4 da largura do card.
const PHONE_SIZES = "(min-width: 1280px) 120px, (min-width: 768px) 14vw, 26vw";

const LIFT_ON_HOVER =
  "transition-transform duration-500 ease-out group-hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0";

// Área visual 16:10 do card de projeto. Mostra só capturas REAIS
// (project.media); sem elas, um painel de marca com nome e categoria —
// nunca uma interface inventada que pareça captura de tela.
export function ProjectMedia({ project, category }: ProjectMediaProps) {
  const t = useTranslations();
  const alts = t.projects.media;
  const media = project.media;
  const withTitle = (text: string) => text.replace("{title}", project.title);

  return (
    <div className="project-media relative aspect-16/10 w-full overflow-hidden border-b border-border">
      {media?.kind === "screenshot" && (
        <ScreenshotFrame src={media.src} alt={withTitle(alts.screenshotAlt)} />
      )}
      {media?.kind === "phone" && (
        <div className="absolute inset-0 flex items-center justify-center gap-[6%] pt-[3%]">
          {media.screens.map((screen, index) => (
            <PhoneFrame
              key={screen.src}
              src={screen}
              alt={withTitle(alts.phoneAlts[index])}
              className={index === 1 ? "translate-y-[5%]" : "-translate-y-[3%]"}
            />
          ))}
        </div>
      )}
      {!media && <BrandPanel title={project.title} category={category} />}
    </div>
  );
}

// Captura desktop dentro de uma janela discreta que "sai" da base do card.
function ScreenshotFrame({ src, alt }: { src: StaticImageData; alt: string }) {
  return (
    <div
      className={`absolute inset-x-[7%] top-[9%] overflow-hidden rounded-t-lg border border-b-0 border-border-strong bg-surface shadow-2xl shadow-black/40 ${LIFT_ON_HOVER}`}
    >
      <div aria-hidden="true" className="flex h-4 items-center gap-1 border-b border-border bg-surface-strong px-2">
        <span className="h-1.5 w-1.5 rounded-full bg-border-strong" />
        <span className="h-1.5 w-1.5 rounded-full bg-border-strong" />
        <span className="h-1.5 w-1.5 rounded-full bg-border-strong" />
      </div>
      <Image src={src} alt={alt} sizes={CARD_SIZES} placeholder="blur" className="block h-auto w-full" />
    </div>
  );
}

// Tela de app em moldura de smartphone. A moldura segue a proporção da
// captura (object-cover só absorve a borda de 3px) — sem cortes ruins.
function PhoneFrame({ src, alt, className }: { src: StaticImageData; alt: string; className: string }) {
  return (
    <div className={`h-[82%] ${className}`}>
      <div
        className={`relative h-full overflow-hidden rounded-[14px] border-[3px] border-black/85 bg-black shadow-2xl shadow-black/50 ring-1 ring-border-strong ${LIFT_ON_HOVER}`}
        style={{ aspectRatio: `${src.width} / ${src.height}` }}
      >
        <Image src={src} alt={alt} fill sizes={PHONE_SIZES} placeholder="blur" className="object-cover object-top" />
      </div>
    </div>
  );
}

// Sem captura pública: painel de marca (monograma, nome e categoria).
// Decorativo — o título e a categoria já estão no corpo do card.
function BrandPanel({ title, category }: { title: string; category: string }) {
  const monogram = title
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

  return (
    <div aria-hidden="true" className="relative flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border-accent bg-accent/10 font-mono text-lg font-semibold tracking-tight text-accent shadow-lg shadow-accent/10 transition-transform duration-500 ease-out group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
        {monogram}
      </span>
      <span className="text-base font-semibold tracking-tight text-text-primary">{title}</span>
      <span className="font-mono text-[11px] uppercase tracking-wider text-text-muted">{category}</span>
    </div>
  );
}
