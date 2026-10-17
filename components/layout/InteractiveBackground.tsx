"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export type InteractiveBackgroundVariant = "glow" | "grid" | "subtle" | "none";
type InteractiveBackgroundIntensity = "normal" | "minimal";

type RouteBackground = {
  variant: InteractiveBackgroundVariant;
  intensity?: InteractiveBackgroundIntensity;
};

// Efeito por rota. Rotas fora da lista usam o padrão discreto.
const ROUTE_BACKGROUNDS: Record<string, RouteBackground> = {
  "/": { variant: "glow" },
  "/services": { variant: "grid" },
  "/projects": { variant: "subtle" },
  "/about": { variant: "subtle" },
  // Mínimo: o foco da página é o formulário.
  "/contact": { variant: "subtle", intensity: "minimal" },
  "/skills": { variant: "subtle" },
  "/certificates": { variant: "subtle" },
};

const DEFAULT_BACKGROUND: RouteBackground = { variant: "subtle" };

// Só reage a um mouse de verdade (hover + ponteiro fino) e sem
// prefers-reduced-motion. Em touch e movimento reduzido, nenhum listener é
// registrado e o fundo fica estático (camadas do PageBackground).
const POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

// Suavização: fração da distância restante percorrida a cada quadro. O loop
// de requestAnimationFrame só roda enquanto a luz alcança o cursor e para
// sozinho quando a diferença fica abaixo de SETTLE_PX — cursor parado, zero
// trabalho.
const EASING = 0.2;
const SETTLE_PX = 0.5;

// Proteção para máquinas lentas: mover uma camada por baixo do conteúdo faz
// o navegador recalcular camadas a cada quadro (~2ms numa CPU comum, ~8ms
// numa 4x mais lenta). Enquanto a luz se move, a média do intervalo entre
// quadros é medida; se ficar acima de SLOW_FRAME_MS (~40 fps) por
// MIN_SAMPLED_FRAMES quadros, o efeito se desliga até recarregar a página e
// o fundo volta a ser só o estático.
const SLOW_FRAME_MS = 24;
const MIN_SAMPLED_FRAMES = 30;
const FRAME_AVERAGE_WEIGHT = 0.1;
// Intervalos muito longos (aba em segundo plano, pausa do sistema) não
// representam o custo do efeito e ficam fora da média.
const MAX_SAMPLED_INTERVAL_MS = 100;

// Compartilhado entre montagens: uma vez desligado, segue desligado na
// navegação entre rotas da mesma sessão de página.
let isDisabledForSlowFrames = false;

type InteractiveBackgroundProps = {
  // Sobrescreve a configuração da rota (ex.: testes ou páginas futuras).
  variant?: InteractiveBackgroundVariant;
  intensity?: InteractiveBackgroundIntensity;
};

// Luz que segue o mouse atrás do conteúdo (dentro do PageBackground: fixo,
// sem eventos de ponteiro, oculto de leitores de tela). A posição é escrita
// direto no `transform` das camadas via refs — nenhuma re-renderização do
// React e nenhuma repintura por movimento, só composição na GPU. O HTML do
// servidor e o do cliente são iguais (o estado ativo é só um atributo
// aplicado no DOM após o primeiro movimento), sem hydration mismatch.
export function InteractiveBackground({ variant, intensity }: InteractiveBackgroundProps) {
  const pathname = usePathname();
  const routeBackground = ROUTE_BACKGROUNDS[pathname] ?? DEFAULT_BACKGROUND;
  const resolvedVariant = variant ?? routeBackground.variant;
  const resolvedIntensity = intensity ?? routeBackground.intensity ?? "normal";
  const layerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const gridWindowRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const glow = glowRef.current;
    const gridWindow = gridWindowRef.current;
    const grid = gridRef.current;
    if (!layer || !glow || !gridWindow || !grid || resolvedVariant === "none") return;
    if (isDisabledForSlowFrames) {
      layer.dataset.lowPower = "true";
      return;
    }

    const movesGrid = resolvedVariant === "grid";

    const pointerQuery = window.matchMedia(POINTER_QUERY);
    const motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let hasPosition = false;
    let isListening = false;
    let lastFrameTime = 0;
    let averageFrameMs = 0;
    let sampledFrames = 0;

    // A janela circular da grade anda com o cursor e a grade dentro dela
    // anda ao contrário: as linhas ficam paradas, alinhadas à grade do
    // PageBackground, e só o recorte se move.
    const writePosition = () => {
      const position = `translate3d(${currentX}px, ${currentY}px, 0)`;
      glow.style.transform = position;
      if (!movesGrid) return;
      gridWindow.style.transform = position;
      grid.style.transform = `translate3d(${-currentX}px, ${-currentY}px, 0)`;
    };

    // Devolve true quando o efeito acabou de ser desligado por lentidão.
    const recordFrame = (time: number) => {
      const interval = lastFrameTime ? time - lastFrameTime : 0;
      lastFrameTime = time;
      if (interval <= 0 || interval > MAX_SAMPLED_INTERVAL_MS) return false;

      sampledFrames += 1;
      averageFrameMs = averageFrameMs
        ? averageFrameMs + (interval - averageFrameMs) * FRAME_AVERAGE_WEIGHT
        : interval;
      if (sampledFrames < MIN_SAMPLED_FRAMES || averageFrameMs <= SLOW_FRAME_MS) return false;

      isDisabledForSlowFrames = true;
      layer.dataset.lowPower = "true";
      stopListening();
      return true;
    };

    const step = (time: number) => {
      if (recordFrame(time)) return;

      const dx = targetX - currentX;
      const dy = targetY - currentY;

      if (Math.abs(dx) < SETTLE_PX && Math.abs(dy) < SETTLE_PX) {
        currentX = targetX;
        currentY = targetY;
        writePosition();
        frame = 0;
        // Próximo movimento começa uma nova sequência de quadros.
        lastFrameTime = 0;
        return;
      }

      currentX += dx * EASING;
      currentY += dy * EASING;
      writePosition();
      frame = window.requestAnimationFrame(step);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      targetX = event.clientX;
      targetY = event.clientY;

      // Primeiro movimento: a luz nasce sob o cursor (sem "voar" do canto).
      if (!hasPosition) {
        hasPosition = true;
        currentX = targetX;
        currentY = targetY;
        writePosition();
        layer.dataset.active = "true";
        return;
      }

      if (!frame) frame = window.requestAnimationFrame(step);
    };

    // Cursor saiu da janela (ou ela perdeu o foco): a luz apaga devagar.
    const handlePointerLeave = () => {
      hasPosition = false;
      layer.dataset.active = "false";
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const startListening = () => {
      if (isListening) return;
      isListening = true;
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", handlePointerLeave);
      window.addEventListener("blur", handlePointerLeave);
    };

    const stopListening = () => {
      if (!isListening) return;
      isListening = false;
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
      handlePointerLeave();
    };

    // Reavalia quando o usuário troca de dispositivo (ex.: tablet com mouse)
    // ou liga/desliga o movimento reduzido com a página aberta.
    const syncWithEnvironment = () => {
      if (pointerQuery.matches && !motionQuery.matches) startListening();
      else stopListening();
    };

    syncWithEnvironment();
    pointerQuery.addEventListener("change", syncWithEnvironment);
    motionQuery.addEventListener("change", syncWithEnvironment);

    return () => {
      pointerQuery.removeEventListener("change", syncWithEnvironment);
      motionQuery.removeEventListener("change", syncWithEnvironment);
      stopListening();
    };
  }, [resolvedVariant]);

  return (
    <div
      ref={layerRef}
      className="interactive-bg"
      data-variant={resolvedVariant}
      data-intensity={resolvedIntensity}
    >
      <div ref={gridWindowRef} className="interactive-bg__grid-window">
        <div ref={gridRef} className="interactive-bg__grid" />
      </div>
      <div ref={glowRef} className="interactive-bg__glow" />
    </div>
  );
}
