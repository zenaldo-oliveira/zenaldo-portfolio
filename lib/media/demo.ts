import type { StaticImageData } from "next/image";
import { getServiceOffer } from "@/lib/catalog/data";
import type { ServiceOfferId } from "@/lib/catalog/data";
import { OFFER_SCREENSHOTS } from "@/lib/media/screenshots";
import type { LanguageCode } from "@/lib/i18n/types";
import cafeteria from "@/public/projects/screenshots/cafeteria.webp";
import turismo from "@/public/projects/screenshots/turismo.webp";

// Vídeo de demonstração do Hero da Home. Ainda não existe gravação real:
// enquanto for null, o Hero mostra a captura de um projeto real.
//
// Para ativar, coloque os arquivos em public/media/ (sem áudio, idealmente
// ≤ 1920px e poucos MB, gravação de um projeto real) e preencha, por exemplo:
//   export const HOME_DEMO_VIDEO: DemoVideo = {
//     webm: "/media/ztech-demo.webm",
//     mp4: "/media/ztech-demo.mp4",
//     poster: demoPoster, // import demoPoster from "@/public/media/ztech-demo-poster.webp"
//     description: { pt: "O vídeo mostra…", en: "The video shows…", es: "El video muestra…" },
//   };
export type DemoVideo = {
  webm?: string;
  mp4?: string;
  poster?: StaticImageData;
  // Descrição do que a gravação mostra (vídeo sem áudio precisa de
  // alternativa em texto — WCAG 1.2.1).
  description: Record<LanguageCode, string>;
};

export const HOME_DEMO_VIDEO: DemoVideo | null = null;

// Sem vídeo: espiral com as capturas desktop reais destas ofertas do
// catálogo (media "screenshot"), um projeto por card, sem repetição. A
// primeira também é a captura estática do celular, do movimento reduzido e
// de quem navega sem JavaScript.
export const HERO_SHOWCASE_OFFERS: readonly ServiceOfferId[] = [
  "business-site",
  "landing",
  "automation-ai",
];

// Origem do texto alternativo traduzido de cada captura: o da oferta do
// catálogo (t.commercial.showcase.offers[offerId].imageAlt) ou o modelo de
// captura de projeto (t.projects.media.screenshotAlt, com o nome).
export type HeroShowcaseAlt = { source: "offer"; offerId: ServiceOfferId } | { source: "project" };

export type HeroShowcaseItem = {
  // Identificador do projeto na vitrine (chave de lista) — não é chave de
  // tradução.
  id: string;
  project: string;
  image: StaticImageData;
  alt: HeroShowcaseAlt;
};

export const HERO_SHOWCASE: readonly HeroShowcaseItem[] = [
  ...HERO_SHOWCASE_OFFERS.flatMap((id): HeroShowcaseItem[] => {
    const media = getServiceOffer(id)?.media;

    return media?.kind === "screenshot"
      ? [
          {
            id: media.file,
            project: media.project,
            image: OFFER_SCREENSHOTS[media.file],
            alt: { source: "offer", offerId: id },
          },
        ]
      : [];
  }),

  // Novos projetos na espiral da Home.
  {
    id: "cafeteria",
    project: "Cafeteria",
    image: cafeteria,
    alt: { source: "project" },
  },
  {
    id: "turismo",
    project: "Turismo",
    image: turismo,
    alt: { source: "project" },
  },
];

// Texto alternativo traduzido de uma captura da vitrine, a partir da sua
// origem (oferta do catálogo ou modelo de captura de projeto).
export function heroShowcaseAlt(
  item: HeroShowcaseItem,
  offerAlt: (offerId: ServiceOfferId) => string,
  projectAlt: (project: string) => string,
): string {
  return item.alt.source === "offer" ? offerAlt(item.alt.offerId) : projectAlt(item.project);
}
