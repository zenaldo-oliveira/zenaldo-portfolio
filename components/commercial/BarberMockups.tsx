"use client";

import { CalendarClock, Crown, Scissors, UserRound } from "lucide-react";
import { useTranslations } from "@/lib/i18n/LanguageContext";

// Ilustrações (não são capturas de um produto pronto — os cards as rotulam
// como "Imagem ilustrativa"). Só rótulos e formas: sem nomes, métricas ou
// números que pareçam dados reais.

const WINDOW = "w-full overflow-hidden rounded-xl border border-border-strong bg-surface shadow-2xl shadow-black/30";
const BAR = "h-1.5 rounded-full bg-border-strong";

function WindowBar() {
  return (
    <div className="flex h-5 items-center gap-1 border-b border-border bg-surface-strong px-2.5">
      <span className="h-1.5 w-1.5 rounded-full bg-border-strong" />
      <span className="h-1.5 w-1.5 rounded-full bg-border-strong" />
      <span className="h-1.5 w-1.5 rounded-full bg-border-strong" />
    </div>
  );
}

// Agenda: serviço, profissional e horário.
export function AgendaMockup() {
  const m = useTranslations().commercial.barber.mock;

  return (
    <div className={WINDOW}>
      <WindowBar />
      <div className="space-y-3 p-3.5">
        <div>
          <p className="text-[10px] font-medium text-text-muted">{m.service}</p>
          <div className="mt-1.5 flex gap-1.5">
            <span className="flex items-center gap-1 rounded-md border border-accent bg-accent/15 px-2 py-1">
              <Scissors size={10} className="text-accent" />
              <span className={`${BAR} w-8 bg-accent/60`} />
            </span>
            <span className="rounded-md border border-border px-2 py-1">
              <span className={`${BAR} block w-10`} />
            </span>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-medium text-text-muted">{m.professional}</p>
          <div className="mt-1.5 flex gap-2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`flex h-7 w-7 items-center justify-center rounded-full border ${i === 0 ? "border-accent bg-accent/15 text-accent" : "border-border text-text-muted"}`}
              >
                <UserRound size={12} />
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] font-medium text-text-muted">{m.time}</p>
          <div className="mt-1.5 grid grid-cols-4 gap-1.5">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <span key={i} className={`h-4 rounded ${i === 2 ? "bg-accent" : "border border-border"}`} />
            ))}
          </div>
        </div>
        <span className="flex h-6 items-center justify-center rounded-md bg-cta text-[10px] font-semibold text-white">{m.confirm}</span>
      </div>
    </div>
  );
}

// Prime: área do assinante com o plano, uso no mês e próximo horário.
export function PrimeMockup() {
  const m = useTranslations().commercial.barber.mock;

  return (
    <div className={WINDOW}>
      <WindowBar />
      <div className="space-y-3 p-3.5">
        <p className="text-[11px] font-semibold text-text-primary">{m.subscriberArea}</p>
        <div className="rounded-lg border border-border-accent bg-accent/10 p-2.5">
          <span className="flex items-center gap-1.5 text-[10px] font-medium text-accent">
            <Crown size={11} />
            {m.plan}
          </span>
          <p className="mt-2 text-[10px] text-text-muted">{m.usage}</p>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-border">
            <div className="h-full w-1/2 rounded-full bg-accent" />
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border p-2.5">
          <CalendarClock size={14} className="shrink-0 text-accent" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-text-muted">{m.nextVisit}</p>
            <span className={`${BAR} mt-1 block w-2/3`} />
          </div>
        </div>
      </div>
    </div>
  );
}
