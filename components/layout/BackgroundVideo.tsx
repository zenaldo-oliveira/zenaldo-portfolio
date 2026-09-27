"use client";

import { useSyncExternalStore } from "react";

export type BackgroundVideoSource = {
  // Ao menos um formato. WebM costuma ser menor; MP4 é o fallback universal.
  webm?: string;
  mp4?: string;
  // Imagem estática usada em movimento reduzido, no mobile e enquanto o
  // vídeo carrega. Opcional — sem ela, fica só o fundo em CSS.
  poster?: string;
};

// Vídeo só em telas ≥ 768px e sem prefers-reduced-motion. No mobile e em
// movimento reduzido, o vídeo nem é baixado (fica poster ou gradiente CSS).
const PLAYBACK_QUERY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

type NetworkInformation = { saveData?: boolean };

function subscribe(onChange: () => void) {
  const query = window.matchMedia(PLAYBACK_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function canPlayVideo(): boolean {
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  return window.matchMedia(PLAYBACK_QUERY).matches && !connection?.saveData;
}

// `muted` como propriedade antes do play: exigência das políticas de
// autoplay. Falha de play (ex.: bloqueio do navegador) é silenciosa — o fundo
// em CSS continua por baixo. Fora do componente: referência estável, o ref
// não roda de novo a cada render.
function startMutedPlayback(video: HTMLVideoElement | null) {
  if (!video) return;
  video.muted = true;
  video.play().catch(() => {});
}

// Camada de mídia do PageBackground. Renderizada só no cliente (snapshot do
// servidor = false): o HTML inicial nunca inclui o vídeo, então ele não
// compete com o conteúdo pelo carregamento (LCP).
export function BackgroundVideo({ webm, mp4, poster }: BackgroundVideoSource) {
  const shouldPlay = useSyncExternalStore(subscribe, canPlayVideo, () => false);

  if (!shouldPlay) {
    return poster ? (
      <>
        <div
          className="page-background__media"
          style={{ backgroundImage: `url(${poster})` }}
        />
        <div className="page-background__overlay" />
      </>
    ) : null;
  }

  return (
    <>
      <video
        className="page-background__media"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        disablePictureInPicture
        tabIndex={-1}
        ref={startMutedPlayback}
      >
        {webm && <source src={webm} type="video/webm" />}
        {mp4 && <source src={mp4} type="video/mp4" />}
      </video>
      <div className="page-background__overlay" />
    </>
  );
}
