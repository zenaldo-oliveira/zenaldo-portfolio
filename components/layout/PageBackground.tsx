import { BackgroundVideo } from "@/components/layout/BackgroundVideo";
import type { BackgroundVideoSource } from "@/components/layout/BackgroundVideo";

// Vídeo de fundo global. Nenhum vídeo existe hoje em public/ — até o asset
// ser adicionado, o fundo usa só as camadas em CSS (gradientes + grid).
// Para ativar: coloque os arquivos em public/media/ (ex.: ztech-bg.webm,
// ztech-bg.mp4 e ztech-bg-poster.jpg — idealmente ≤ 1920px, sem áudio,
// poucos MB) e preencha abaixo, por exemplo:
//   { webm: "/media/ztech-bg.webm", mp4: "/media/ztech-bg.mp4", poster: "/media/ztech-bg-poster.jpg" }
export const BACKGROUND_VIDEO: BackgroundVideoSource | null = null;

type PageBackgroundProps = {
  video?: BackgroundVideoSource | null;
};

// Fundo compartilhado por todas as páginas (renderizado uma vez em
// app/layout.tsx): base azul-grafite com brilhos estáticos, vídeo opcional
// com baixa opacidade + overlay, e um grid de 1px que desaparece nas bordas.
// Fixo, atrás do conteúdo, sem eventos de ponteiro e oculto de leitores de
// tela. É cenário: nunca deve competir com o conteúdo.
export function PageBackground({ video = BACKGROUND_VIDEO }: PageBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="page-background__base" />
      {video && <BackgroundVideo {...video} />}
      <div className="page-background__grid" />
    </div>
  );
}
