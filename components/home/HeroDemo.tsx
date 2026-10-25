"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { HeroSpiral } from "@/components/home/HeroSpiral";
import { HERO_SHOWCASE, heroShowcaseAlt, HOME_DEMO_VIDEO } from "@/lib/media/demo";
import type { DemoVideo } from "@/lib/media/demo";
import { useLanguage, useTranslations } from "@/lib/i18n/LanguageContext";

const EASE = [0.16, 1, 0.3, 1] as const;

const controlClass =
  "inline-flex h-9 items-center justify-center rounded-full border border-border-strong bg-background/85 text-text-primary backdrop-blur transition-colors hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

// Demonstração à direita do Hero. Com vídeo configurado (lib/media/demo.ts):
// vídeo mudo em loop com pausar/reproduzir. Sem vídeo: espiral com as
// capturas reais dos projetos (HeroSpiral) a partir de 768px; abaixo disso,
// com movimento reduzido ou sem JavaScript, uma captura real estática.
// Entrada só por deslocamento e escala (sem opacidade), para não atrasar o LCP.
export function HeroDemo({ video = HOME_DEMO_VIDEO }: { video?: DemoVideo | null }) {
  const t = useTranslations();
  const d = t.commercial.home;

  // `initial` igual no servidor e no cliente; com movimento reduzido a
  // MotionConfig global (AppShell) torna a entrada instantânea.
  return (
    <motion.figure
      initial={{ y: 28, scale: 0.97 }}
      animate={{ y: 0, scale: 1 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
      className="relative w-full max-w-160 justify-self-center xl:flex xl:flex-col xl:justify-self-end"
    >
      {video ? (
        <BrowserFrame label={d.demoLabel}>
          <DemoVideoPlayer video={video} />
        </BrowserFrame>
      ) : (
        <HeroSpiral fallback={<StaticCapture />} />
      )}
      <figcaption className="mt-3 text-center text-xs text-text-muted xl:text-left">{d.demoCaption}</figcaption>
    </motion.figure>
  );
}

function BrowserFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-border-strong bg-surface shadow-2xl shadow-black/40">
      <div className="flex h-8 items-center gap-1.5 border-b border-border bg-surface-strong px-3.5">
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-border-strong" />
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-border-strong" />
        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-border-strong" />
        <span className="ml-3 truncate rounded-md bg-background/60 px-2.5 py-0.5 font-mono text-[11px] text-text-muted">{label}</span>
      </div>
      <div className="relative aspect-16/10 w-full bg-background">{children}</div>
    </div>
  );
}

// Captura real estática do primeiro projeto da vitrine, identificada como
// projeto real (celular, movimento reduzido e sem JavaScript).
function StaticCapture() {
  const t = useTranslations();
  const s = t.commercial.showcase;
  const item = HERO_SHOWCASE[0];
  if (!item) return null;
  const alt = heroShowcaseAlt(
    item,
    (offerId) => s.offers[offerId].imageAlt,
    (project) => t.projects.media.screenshotAlt.replace("{title}", project),
  );

  return (
    <BrowserFrame label={`${s.realProject} · ${item.project}`}>
      <Image
        src={item.image}
        alt={alt}
        fill
        preload
        placeholder="blur"
        sizes="(min-width: 1280px) 640px, 92vw"
        className="object-cover object-top"
      />
    </BrowserFrame>
  );
}

function DemoVideoPlayer({ video }: { video: DemoVideo }) {
  const t = useTranslations();
  const d = t.commercial.home;
  const { language } = useLanguage();
  const prefersReducedMotion = useReducedMotion() ?? false;
  const ref = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Autoplay só sem movimento reduzido (e só mudo, exigência dos navegadores).
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (prefersReducedMotion) {
      element.pause();
      return;
    }
    element.muted = true;
    element.play().catch(() => {
      // Bloqueio de autoplay: fica no pôster, o botão continua disponível.
    });
  }, [prefersReducedMotion]);

  function toggle() {
    const element = ref.current;
    if (!element) return;
    if (element.paused) {
      element.muted = true;
      element.play().catch(() => {});
    } else {
      element.pause();
    }
  }

  return (
    <>
      <video
        ref={ref}
        aria-label={d.demoLabel}
        aria-describedby="hero-demo-description"
        className="absolute inset-0 h-full w-full object-cover object-top"
        muted
        loop
        playsInline
        preload="metadata"
        poster={video.poster?.src}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        {video.webm && <source src={video.webm} type="video/webm" />}
        {video.mp4 && <source src={video.mp4} type="video/mp4" />}
      </video>
      <p id="hero-demo-description" className="sr-only">
        {video.description[language]}
      </p>
      <button type="button" onClick={toggle} className={`${controlClass} absolute bottom-3 left-3 gap-2 px-3.5 text-xs font-medium`}>
        {isPlaying ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
        {isPlaying ? d.demoPause : d.demoPlay}
      </button>
    </>
  );
}
