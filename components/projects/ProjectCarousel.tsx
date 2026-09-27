"use client";

import { useCallback, useEffect, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type ProjectCarouselItem = {
  key: string;
  title: string;
  content: ReactNode;
};

type ProjectCarouselLabels = {
  region: string;
  previous: string;
  next: string;
  goTo: string;
  of: string;
};

type ProjectCarouselProps = {
  items: ProjectCarouselItem[];
  labels: ProjectCarouselLabels;
};

const NAV_BUTTON_CLASS =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-colors duration-150 hover:border-border-strong hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

// Carrossel horizontal dos projetos (Embla). O slide selecionado fica
// centralizado e em destaque; os vizinhos aparecem parcialmente, menores e
// esmaecidos. Navegação por setas, indicadores, arrastar/swipe e teclado
// (← → com o foco dentro do carrossel). Embla rola até o slide que recebe
// foco via Tab (watchFocus, padrão). Com prefers-reduced-motion, a troca é
// instantânea e sem escala/opacidade animadas.
export function ProjectCarousel({ items, labels }: ProjectCarouselProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [viewportRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const handleSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", handleSelect).on("reInit", handleSelect);

    return () => {
      emblaApi.off("select", handleSelect).off("reInit", handleSelect);
    };
  }, [emblaApi]);

  const scrollPrev = useCallback(
    () => emblaApi?.scrollPrev(prefersReducedMotion),
    [emblaApi, prefersReducedMotion],
  );
  const scrollNext = useCallback(
    () => emblaApi?.scrollNext(prefersReducedMotion),
    [emblaApi, prefersReducedMotion],
  );
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index, prefersReducedMotion),
    [emblaApi, prefersReducedMotion],
  );

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollNext();
    }
  }

  const total = items.length;
  const current = items[selectedIndex];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={labels.region}
      onKeyDown={handleKeyDown}
      className="w-full"
    >
      <div ref={viewportRef} className="overflow-hidden">
        <div className="flex touch-pan-y">
          {items.map((item, index) => {
            const isActive = index === selectedIndex;

            return (
              <div
                key={item.key}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} ${labels.of} ${total}: ${item.title}`}
                className="min-w-0 shrink-0 grow-0 basis-[88%] px-2 sm:basis-[62%] md:basis-[54%] lg:basis-[46%] xl:basis-[38%] 2xl:basis-[32%]"
                // Clique em um card lateral o traz para o centro. Após um
                // arraste, o próprio Embla (v8) cancela o clique.
                onClick={() => {
                  if (!isActive) scrollTo(index);
                }}
              >
                <div
                  className={`h-full origin-center transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none ${
                    isActive ? "scale-100 opacity-100" : "scale-[0.92] opacity-50"
                  }`}
                >
                  {item.content}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Com um só projeto (ex.: filtro), setas e indicadores não fazem sentido. */}
      {total > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <button type="button" onClick={scrollPrev} aria-label={labels.previous} className={NAV_BUTTON_CLASS}>
            <ChevronLeft size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>

          <div className="flex items-center">
            {items.map((item, index) => {
              const isActive = index === selectedIndex;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => scrollTo(index)}
                  aria-label={`${labels.goTo} ${index + 1}: ${item.title}`}
                  aria-current={isActive ? "true" : undefined}
                  className="group flex h-8 w-7 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span
                    aria-hidden="true"
                    className={`block h-1.5 rounded-full transition-[width,background-color] duration-300 ease-out motion-reduce:transition-none ${
                      isActive
                        ? "w-5 bg-accent"
                        : "w-1.5 bg-border-strong group-hover:bg-text-muted"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <button type="button" onClick={scrollNext} aria-label={labels.next} className={NAV_BUTTON_CLASS}>
            <ChevronRight size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Anuncia o projeto atual para leitores de tela a cada troca. */}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {current ? `${current.title} — ${selectedIndex + 1} ${labels.of} ${total}` : ""}
      </p>
    </div>
  );
}
