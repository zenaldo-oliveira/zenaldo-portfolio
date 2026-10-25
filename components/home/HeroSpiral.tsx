"use client";

import { getImageProps } from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import InfiniteSpiral from "@/components/InfiniteSpiral";
import { HERO_SHOWCASE, heroShowcaseAlt } from "@/lib/media/demo";
import { useTranslations } from "@/lib/i18n/LanguageContext";

const SPIRAL_QUERY =
  "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

function subscribeSpiralQuery(onChange: () => void) {
  const query = window.matchMedia(SPIRAL_QUERY);
  query.addEventListener("change", onChange);

  return () => query.removeEventListener("change", onChange);
}

function useCanShowSpiral(): boolean {
  return useSyncExternalStore(
    subscribeSpiralQuery,
    () => window.matchMedia(SPIRAL_QUERY).matches,
    () => false,
  );
}

const SPIRAL_IMAGE = {
  width: 1280,
  height: 800,
  quality: 85,
} as const;

const WHATSAPP_ZONE = 24 + 56 + 16;

const CARD_RATIO = 10 / 16;
const SPACING_SHARE = 0.55;
const RADIUS_SHARE = 0.1;
const PIXELS_PER_SECOND = 36;
const FIT_WIDTH_RATIO = 1.3;
const EDGE_FADE = 0.3;
// Folga mínima entre um card visível e a moldura da área.
const EDGE_GAP = 4;
// Abaixo de 30% de opacidade o card está sumindo de propósito na ponta da
// espiral; acima disso, nunca pode ser cortado pela moldura. Com o fade do
// componente (smoothstep nos últimos EDGE_FADE do meio ciclo), a opacidade
// cai a 30% a ~63% dessa faixa.
const VISIBLE_FADE_SHARE = 0.63;
// Fatores de escala no pior caso (centerScale 1.1, perspective 1000, raio
// de 10% do card): meia largura do card a 90° (≈1,06×) e do card da frente
// (≈1,1 × 1,05), e meia altura de um card quase na ponta (≈1,03×).
const SIDE_HALF_WIDTH = 0.56;
const FRONT_HALF_WIDTH = 0.58;
const EDGE_HALF_HEIGHT = 0.515;

// Maior deslocamento (em cards) de um card ainda visível (≥ 30%).
function maxVisibleOffset(count: number) {
  return (count / 2) * (1 - EDGE_FADE + VISIBLE_FADE_SHARE * EDGE_FADE);
}

// Tamanho dos cards para a área medida e a quantidade de projetos: todo card
// visível cabe inteiro na moldura (em cima, embaixo e dos lados); só os que
// já estão sumindo podem passar dela. Proporção 16:10 das capturas.
function spiralLayout(width: number, height: number, count: number) {
  const halfWidth = width / 2 - EDGE_GAP;
  const halfHeight = height / 2 - EDGE_GAP;
  const widthLimit = Math.min(halfWidth / (RADIUS_SHARE + SIDE_HALF_WIDTH), halfWidth / FRONT_HALF_WIDTH);
  const heightLimit = halfHeight / (maxVisibleOffset(count) * SPACING_SHARE + EDGE_HALF_HEIGHT) / CARD_RATIO;
  const cardWidth = Math.max(1, Math.floor(Math.min(widthLimit, heightLimit)));

  const cardHeight = Math.round(cardWidth * CARD_RATIO);
  const verticalSpacing = Math.max(1, Math.round(cardHeight * SPACING_SHARE));

  return {
    cardWidth,
    cardHeight,
    verticalSpacing,
    radius: Math.round(cardWidth * RADIUS_SHARE),
    speed: PIXELS_PER_SECOND / verticalSpacing,
  };
}

const controlClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border-strong bg-background/85 text-text-primary backdrop-blur transition-colors hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

// Tablet (768–1279px): área de 500px de altura + linha do botão de pausa
// (12px + 36px); a captura estática ocupa a mesma altura, então a troca
// depois da hidratação não desloca nada. Desktop (xl): o bloco ocupa a
// coluna direita inteira do Hero, com a área nunca abaixo de 500px (em
// telas baixas o Hero cresce em vez de encolher as imagens).
const BLOCK_CLASS = "md:min-h-[548px] xl:flex xl:min-h-0 xl:flex-1 xl:flex-col";

type HeroSpiralProps = {
  // Captura estática (celular, movimento reduzido, sem JavaScript).
  fallback: ReactNode;
};

// Integração do InfiniteSpiral à direita do Hero, com as capturas desktop
// reais da vitrine (um projeto por card).
export function HeroSpiral({ fallback }: HeroSpiralProps) {
  const t = useTranslations();
  const d = t.commercial.home;
  const s = t.commercial.showcase;
  const canShowSpiral = useCanShowSpiral();
  const [isPaused, setIsPaused] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const [area, setArea] = useState<{ width: number; height: number } | null>(
    null,
  );
  const [whatsappGap, setWhatsappGap] = useState<number | null>(null);

  // Mede a área da espiral e quanto afastar a vitrine do WhatsApp.
  useEffect(() => {
    if (!canShowSpiral) return;
    const block = blockRef.current;
    const areaEl = areaRef.current;
    if (!block || !areaEl) return;

    const measure = () => {
      const right = block.getBoundingClientRect().right;
      setWhatsappGap(
        Math.max(
          0,
          Math.round(
            right - (document.documentElement.clientWidth - WHATSAPP_ZONE),
          ),
        ),
      );
      const { width, height } = areaEl.getBoundingClientRect();
      setArea((current) =>
        current &&
        Math.abs(current.width - width) < 1 &&
        Math.abs(current.height - height) < 1
          ? current
          : { width, height },
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(block);
    observer.observe(areaEl);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [canShowSpiral]);

  // Sem JavaScript (ou antes de medir), reserva o máximo para o WhatsApp.
  const gapStyle =
    whatsappGap === null ? undefined : { paddingRight: whatsappGap };

  if (!canShowSpiral) {
    return (
      <div
        className={`md:flex md:items-center xl:justify-center xl:pr-18 ${BLOCK_CLASS}`}
        style={gapStyle}
      >
        {fallback}
      </div>
    );
  }

  const layout = area ? spiralLayout(area.width, area.height, HERO_SHOWCASE.length) : null;
  const items = HERO_SHOWCASE.map((item) => {
    const alt = heroShowcaseAlt(
      item,
      (offerId) => s.offers[offerId].imageAlt,
      (project) => t.projects.media.screenshotAlt.replace("{title}", project),
    );
    return {
      id: item.id,
      src: getImageProps({ src: item.image, alt, ...SPIRAL_IMAGE }).props.src,
      alt,
    };
  });

  return (
    <div ref={blockRef} className={`xl:pr-18 ${BLOCK_CLASS}`} style={gapStyle}>
      <div ref={areaRef} className="h-[600px] w-full shrink-0">
        {layout && (
          <InfiniteSpiral
            items={items}
            label={d.demoCaption}
            paused={isPaused}
            animationMode="auto"
            speed={layout.speed}
            radius={layout.radius}
            cardWidth={layout.cardWidth}
            cardHeight={layout.cardHeight}
            verticalSpacing={layout.verticalSpacing}
            fitWidthRatio={FIT_WIDTH_RATIO}
            perspective={1000}
            cardRadius={12}
            centerScale={1.1}
            edgeBlur={0.5}
            cardsPerTurn={HERO_SHOWCASE.length}
            pauseOnHover
            direction="up"
            rotation={0}
            cardTilt={0}
            edgeFade={EDGE_FADE}
            imageFit="contain"
            grayscale={0}
          />
        )}
      </div>
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          aria-label={isPaused ? d.demoPlay : d.demoPause}
          className={controlClass}
        >
          {isPaused ? (
            <Play size={14} aria-hidden="true" />
          ) : (
            <Pause size={14} aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  );
}
