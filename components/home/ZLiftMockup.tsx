"use client";

import { motion } from "framer-motion";
import {
  ArrowUpDown,
  Check,
  ClipboardList,
  FileText,
  ListChecks,
  MousePointer2,
  Plus,
  Search,
  Users,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "@/lib/i18n/LanguageContext";

// Ícones dos módulos reais do ZLift, na mesma ordem de
// t.home.hero.mockup.modules (Clientes, Elevadores, Técnicos, Ordens de
// serviço, Checklist, Relatórios).
const MODULE_ICONS: LucideIcon[] = [Users, ArrowUpDown, Wrench, ClipboardList, ListChecks, FileText];
const ACTIVE_MODULE = 3; // Ordens de serviço

// Cada ordem de serviço mostra em que ETAPA REAL do fluxo do ZLift está
// (índices de t.home.product.flow: 4 Execução, 5 Checklist, 6 Fotos,
// 8 Assinatura, 9 Relatório). O progresso é a posição da etapa dentro do
// fluxo de execução (Execução → Relatório) — não é métrica nem dado real.
const FIRST_EXEC_STAGE = 4;
const LAST_STAGE = 9;
const NEW_ORDER_STAGE = 4;
const ROW_STAGES = [5, 8, 9, 6];

const EASE = [0.16, 1, 0.3, 1] as const;

function progressOf(stage: number) {
  return `${Math.round(((stage - FIRST_EXEC_STAGE + 1) / (LAST_STAGE - FIRST_EXEC_STAGE + 1)) * 100)}%`;
}

function OrderRow({ stageLabel, stage, isDone }: { stageLabel: string; stage: number; isDone: boolean }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-border px-3 py-2.5 last:border-b-0">
      <span className={`h-2 w-2 shrink-0 rounded-full ${isDone ? "bg-emerald-400/90" : "bg-accent"}`} />
      <Users size={11} strokeWidth={1.75} className="shrink-0 text-text-muted" />
      <span className="h-1.5 w-[22%] shrink-0 rounded-full bg-text-muted/30" />
      <span
        className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
          isDone ? "bg-emerald-400/15 text-emerald-500" : "bg-accent/12 text-accent"
        }`}
      >
        {stageLabel}
      </span>
      <span className="hidden h-1 w-14 shrink-0 overflow-hidden rounded-full bg-surface-muted sm:block">
        <span className={`block h-full rounded-full ${isDone ? "bg-emerald-400/80" : "bg-accent"}`} style={{ width: progressOf(stage) }} />
      </span>
    </div>
  );
}

// Mockup CONCEITUAL do ZLift Manager (produto próprio da ZTech). Não existe
// screenshot real no projeto; quando existir, substituir a janela principal
// por ela. Uma única sequência ao carregar: o cursor clica em "Nova ordem" e
// uma ordem aparece no topo (espaço já reservado — sem deslocar o layout).
// Com prefers-reduced-motion (MotionConfig), só opacidade.
export function ZLiftMockup() {
  const t = useTranslations();
  const m = t.home.hero.mockup;
  const flow = t.home.product.flow;

  return (
    <figure className="relative mx-auto w-full max-w-[36rem]">
      {/* Janela principal */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
        className="relative overflow-hidden rounded-xl border border-border-strong bg-surface shadow-[0_30px_80px_-30px_rgba(2,6,23,0.7)]"
        aria-hidden="true"
      >
        {/* Barra da janela */}
        <div className="flex h-9 items-center gap-3 border-b border-border px-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-text-muted/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-text-muted/30" />
            <span className="h-2.5 w-2.5 rounded-full bg-text-muted/30" />
          </div>
          <span className="font-mono text-[11px] text-text-muted">ZLift Manager</span>
          <div className="ml-auto hidden h-5 w-32 items-center gap-1.5 rounded-md border border-border px-2 sm:flex">
            <Search size={10} className="text-text-muted" />
            <span className="h-1.5 w-14 rounded-full bg-surface-muted" />
          </div>
        </div>

        <div className="grid grid-cols-[auto_1fr]">
          {/* Navegação dos módulos */}
          <ul className="space-y-0.5 border-r border-border p-2">
            {m.modules.map((module, index) => {
              const Icon = MODULE_ICONS[index];
              const isActive = index === ACTIVE_MODULE;

              return (
                <li
                  key={module}
                  className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[11px] ${
                    isActive ? "bg-surface-muted font-medium text-text-primary" : "text-text-muted"
                  }`}
                >
                  <Icon size={12} strokeWidth={1.75} className={isActive ? "text-accent" : ""} />
                  <span className="hidden whitespace-nowrap sm:inline">{module}</span>
                </li>
              );
            })}
          </ul>

          {/* Lista de ordens de serviço */}
          <div className="relative min-w-0 p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-xs font-semibold text-text-primary sm:text-sm">{m.ordersTitle}</p>
              <motion.span
                className="inline-flex shrink-0 items-center gap-1 rounded-md bg-cta px-2 py-1 text-[10px] font-medium text-white"
                animate={{ scale: [1, 0.92, 1] }}
                transition={{ duration: 0.3, delay: 1.5 }}
              >
                <Plus size={10} />
                {m.newOrder}
              </motion.span>
            </div>

            <div className="mt-3 overflow-hidden rounded-lg border border-border">
              {/* Nova ordem: espaço reservado desde o início, aparece após o clique. */}
              <motion.div
                initial={{ opacity: 0, backgroundColor: "rgba(96,165,250,0.14)" }}
                animate={{ opacity: 1, backgroundColor: "rgba(96,165,250,0)" }}
                transition={{ opacity: { duration: 0.4, delay: 1.75 }, backgroundColor: { duration: 1.2, delay: 2.4 } }}
                className="border-b border-border"
              >
                <OrderRow stageLabel={flow[NEW_ORDER_STAGE]} stage={NEW_ORDER_STAGE} isDone={false} />
              </motion.div>

              {ROW_STAGES.map((stage, index) => (
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.45 + index * 0.07 }}
                  className="border-b border-border last:border-b-0"
                >
                  <OrderRow stageLabel={flow[stage]} stage={stage} isDone={stage === LAST_STAGE} />
                </motion.div>
              ))}
            </div>

            {/* Cursor: vai até "Nova ordem" e some. */}
            <motion.span
              className="absolute text-text-primary"
              initial={{ left: "62%", top: "92%", opacity: 0 }}
              animate={{ left: "88%", top: "13%", opacity: [0, 1, 1, 0] }}
              transition={{
                left: { duration: 0.9, ease: EASE, delay: 0.6 },
                top: { duration: 0.9, ease: EASE, delay: 0.6 },
                opacity: { duration: 1.9, times: [0, 0.15, 0.75, 1], delay: 0.5 },
              }}
            >
              <MousePointer2 size={14} fill="currentColor" />
            </motion.span>
          </div>
        </div>
      </motion.div>

      {/* Painel flutuante: checklist de execução (itens reais do fluxo) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.6 }}
        className="absolute -bottom-10 left-2 w-44 rounded-xl border border-border-strong bg-surface-overlay p-3 shadow-[0_20px_50px_-20px_rgba(2,6,23,0.7)] backdrop-blur-md sm:-left-8 sm:w-52"
        aria-hidden="true"
      >
        <p className="text-[11px] font-semibold text-text-primary">{m.checklistTitle}</p>
        <ul className="mt-2 space-y-1.5">
          {m.checklistItems.map((item, index) => {
            const isDone = index < 2;

            return (
              <li key={item} className="flex items-center gap-2 text-[11px] text-text-secondary">
                <motion.span
                  className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${
                    isDone ? "border-accent bg-accent text-white" : "border-border-strong"
                  }`}
                  initial={isDone ? { scale: 0.6, opacity: 0 } : false}
                  animate={isDone ? { scale: 1, opacity: 1 } : undefined}
                  transition={{ duration: 0.3, delay: 1 + index * 0.25 }}
                >
                  {isDone && <Check size={9} strokeWidth={3} />}
                </motion.span>
                {item}
              </li>
            );
          })}
        </ul>
      </motion.div>

      {/* Painel flutuante: relatório com assinatura (desktop/tablet) */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.75 }}
        className="absolute -right-3 -top-16 hidden w-40 rounded-xl border border-border-strong bg-surface-overlay p-3 shadow-[0_20px_50px_-20px_rgba(2,6,23,0.7)] backdrop-blur-md sm:block"
        aria-hidden="true"
      >
        <div className="flex items-center gap-1.5">
          <FileText size={12} strokeWidth={1.75} className="text-accent" />
          <p className="text-[11px] font-semibold text-text-primary">{m.reportTitle}</p>
        </div>
        <div className="mt-2 space-y-1.5">
          <span className="block h-1.5 w-full rounded-full bg-text-muted/25" />
          <span className="block h-1.5 w-4/5 rounded-full bg-text-muted/25" />
        </div>
        <svg viewBox="0 0 120 28" className="mt-2 h-6 w-full text-text-secondary" fill="none">
          <motion.path
            d="M4 20c10-14 16-14 18-4s8 8 14-2 10-10 12 0 10 6 18-4 12-6 16 2 12 4 34-2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 1.3 }}
          />
        </svg>
      </motion.div>

      <figcaption className="mt-4 text-right font-mono text-[11px] text-text-muted">{m.caption}</figcaption>
    </figure>
  );
}
