"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import { PROJECTS } from "@/lib/projects/data";

export type SiteSlide = { title: string; image: StaticImageData; demo?: string };

// Capturas reais (media "screenshot") dos projetos que o catálogo liga ao
// serviço — nunca imagens fictícias nem projetos repetidos.
export function getSiteSlides(projectTitles: readonly string[]): SiteSlide[] {
  return projectTitles.flatMap((title) => {
    const project = PROJECTS.find((item) => item.title === title);
    return project?.media?.kind === "screenshot" ? [{ title, image: project.media.src, demo: project.demo }] : [];
  });
}

// Transição pixelada: a nova captura aparece em blocos que diminuem
// (32 → 4px) e, ao final, fica a imagem real, nítida. ~260ms no total.
const PIXEL_STEPS = [32, 16, 8, 4];
const STEP_MS = 65;
const SWIPE_MIN = 40;
// Já carrega a próxima captura quando o carrossel está a até 300px da tela.
const NEAR_MARGIN = "300px 0px";
const IMAGE_SIZES = "(min-width: 1280px) 520px, (min-width: 1024px) 42vw, 90vw";

const NAV_BUTTON_CLASS =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-colors duration-150 hover:border-border-strong hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

// Aproximação de 3% no hover do card (group/visual), recortada pela moldura,
// só com mouse e sem movimento reduzido — igual aos outros serviços.
const ZOOM_CLASS =
  "motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:[@media(hover:hover)_and_(pointer:fine)]:group-hover/visual:scale-[1.03]";

// Retângulo "contain" da imagem dentro da área (sem distorção).
function containRect(img: HTMLImageElement, width: number, height: number) {
  const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight);
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  return { x: (width - w) / 2, y: (height - h) / 2, w, h };
}

type SitesShowcaseProps = { slides: SiteSlide[] };

// Carrossel do card visual do serviço "sites" (/services#detalhes): uma
// captura real por vez, nome do projeto e "Ver site". Navegação manual por
// setas, indicadores, arraste horizontal e ← → dentro do carrossel. Com
// movimento reduzido (ou se o canvas/imagem falhar), a troca é imediata.
// Servidor e primeira renderização são sempre iguais (1ª captura, canvas
// oculto): a preferência de movimento só é lida no momento da troca.
export function SitesShowcase({ slides }: SitesShowcaseProps) {
  const t = useTranslations();
  const page = t.commercial.servicesPage;
  const labels = t.projects.carousel;
  const total = slides.length;

  const [index, setIndex] = useState(0);
  const [isNear, setIsNear] = useState(false);
  // Capturas já vistas (ficam montadas); a próxima entra quando perto da tela.
  const [visited, setVisited] = useState<number[]>([0]);
  const [isPixelating, setIsPixelating] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smallCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRefs = useRef(new Map<number, HTMLImageElement>());
  const frameRef = useRef<number | null>(null);
  const pointerRef = useRef<{ id: number; x: number; y: number } | null>(null);

  const mount = useCallback((slideIndex: number) => {
    setVisited((current) => (current.includes(slideIndex) ? current : [...current, slideIndex]));
  }, []);

  const cancelPixelation = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    setIsPixelating(false);
  }, []);

  // Cancela qualquer quadro pendente ao desmontar.
  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  // Perto da tela: carrega a próxima captura (não todas as futuras).
  useEffect(() => {
    const root = rootRef.current;
    if (!root || total < 2) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setIsNear(true);
        observer.disconnect();
      },
      { rootMargin: NEAR_MARGIN },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [total]);

  // Desenha a captura em blocos de `block` px; false se o canvas falhar.
  const startPixelation = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !stage || !ctx) return false;
    const small = smallCanvasRef.current ?? document.createElement("canvas");
    smallCanvasRef.current = small;
    const smallCtx = small.getContext("2d");
    if (!smallCtx) return false;

    const width = stage.clientWidth;
    const height = stage.clientHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const rect = containRect(img, width, height);

    const draw = (block: number) => {
      const sw = Math.max(1, Math.ceil(rect.w / block));
      const sh = Math.max(1, Math.ceil(rect.h / block));
      small.width = sw;
      small.height = sh;
      smallCtx.drawImage(img, 0, 0, sw, sh);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(small, 0, 0, sw, sh, rect.x * dpr, rect.y * dpr, rect.w * dpr, rect.h * dpr);
    };

    try {
      draw(PIXEL_STEPS[0]);
    } catch {
      return false;
    }
    setIsPixelating(true);

    const start = performance.now();
    let drawnStep = 0;
    const tick = (now: number) => {
      // O carimbo do rAF pode ser anterior a `start` (início do quadro).
      const step = Math.max(0, Math.floor((now - start) / STEP_MS));
      if (step >= PIXEL_STEPS.length) {
        frameRef.current = null;
        setIsPixelating(false);
        return;
      }
      if (step !== drawnStep) {
        drawnStep = step;
        try {
          draw(PIXEL_STEPS[step]);
        } catch {
          frameRef.current = null;
          setIsPixelating(false);
          return;
        }
      }
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return true;
  }, []);

  const goTo = useCallback(
    (target: number) => {
      if (total < 2) return;
      const next = ((target % total) + total) % total;
      if (next === index) return;
      cancelPixelation();
      mount(next);
      setIndex(next);
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const img = imageRefs.current.get(next);
      // Troca imediata: movimento reduzido, imagem ainda não carregada ou falha.
      if (reducedMotion || !img || !img.complete || img.naturalWidth === 0) return;
      startPixelation(img);
    },
    [total, index, cancelPixelation, mount, startPixelation],
  );

  // ← → só dentro do carrossel e nunca em campos editáveis.
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const target = event.target as HTMLElement;
    if (target.closest("input, textarea, select, [contenteditable='true']")) return;
    event.preventDefault();
    goTo(index + (event.key === "ArrowRight" ? 1 : -1));
  }

  // Arraste horizontal (touch-action: pan-y mantém a rolagem vertical).
  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    pointerRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = pointerRef.current;
    pointerRef.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) >= SWIPE_MIN && Math.abs(dx) > Math.abs(dy)) goTo(index + (dx < 0 ? 1 : -1));
  }

  const current = slides[index] ?? slides[0];
  if (!current) return null;
  const altFor = (title: string) => t.projects.media.screenshotAlt.replace("{title}", title);
  const hasNavigation = total > 1;
  const nextIndex = (index + 1) % total;
  const mounted = isNear && !visited.includes(nextIndex) ? [...visited, nextIndex] : visited;

  const stage = (
    <div
      ref={stageRef}
      {...(hasNavigation
        ? {
            role: "group",
            "aria-roledescription": "slide",
            "aria-label": `${index + 1} ${labels.of} ${total}: ${current.title}`,
            onPointerDown: handlePointerDown,
            onPointerUp: handlePointerUp,
            onPointerCancel: () => {
              pointerRef.current = null;
            },
          }
        : {})}
      className="relative aspect-16/10 w-full touch-pan-y overflow-hidden rounded-xl border border-border-strong bg-background"
    >
      <div className={`absolute inset-0 ${ZOOM_CLASS}`}>
        {mounted.map((slideIndex) => {
          const slide = slides[slideIndex];
          if (!slide) return null;
          const isActive = slideIndex === index;
          return (
            <Image
              key={slide.title}
              ref={(node) => {
                if (node) imageRefs.current.set(slideIndex, node);
                else imageRefs.current.delete(slideIndex);
              }}
              src={slide.image}
              alt={isActive ? altFor(slide.title) : ""}
              aria-hidden={isActive ? undefined : true}
              fill
              sizes={IMAGE_SIZES}
              placeholder="blur"
              draggable={false}
              className={`select-none object-contain ${isActive ? "opacity-100" : "opacity-0"}`}
            />
          );
        })}
        {/* Camada decorativa da transição: nunca recebe foco nem cliques. */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 h-full w-full ${isPixelating ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </div>
  );

  // Só a captura ativa tem nome e link: slides inativos não têm links.
  const caption = (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <p className="text-sm font-semibold text-text-primary">{current.title}</p>
      {current.demo && (
        <a
          href={current.demo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${page.viewSite}: ${current.title}`}
          className="inline-flex items-center gap-1.5 rounded-md text-sm font-medium text-accent transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {page.viewSite}
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      )}
    </div>
  );

  // Um só projeto: captura estática, sem navegação.
  if (!hasNavigation) {
    return (
      <div className="w-full">
        {stage}
        {caption}
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={page.showcaseLabel}
      onKeyDown={handleKeyDown}
      className="w-full"
    >
      {stage}
      {caption}

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => goTo(index - 1)} aria-label={labels.previous} className={NAV_BUTTON_CLASS}>
            <ChevronLeft size={17} strokeWidth={1.75} aria-hidden="true" />
          </button>
          <div className="flex items-center">
            {slides.map((slide, slideIndex) => {
              const isActive = slideIndex === index;
              return (
                <button
                  key={slide.title}
                  type="button"
                  onClick={() => goTo(slideIndex)}
                  aria-label={`${labels.goTo} ${slideIndex + 1}: ${slide.title}`}
                  aria-current={isActive ? "true" : undefined}
                  className="group flex h-8 w-7 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span
                    aria-hidden="true"
                    className={`block h-1.5 rounded-full transition-[width,background-color] duration-300 ease-out motion-reduce:transition-none ${
                      isActive ? "w-5 bg-accent" : "w-1.5 bg-border-strong group-hover:bg-text-muted"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <button type="button" onClick={() => goTo(index + 1)} aria-label={labels.next} className={NAV_BUTTON_CLASS}>
            <ChevronRight size={17} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
        <p aria-hidden="true" className="font-mono text-xs text-text-muted">
          {index + 1} {labels.of} {total}
        </p>
      </div>

      {/* Anuncia só a captura ativa a cada troca. */}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {`${current.title} — ${index + 1} ${labels.of} ${total}`}
      </p>
    </div>
  );
}
