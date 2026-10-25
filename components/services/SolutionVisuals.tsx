"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  Brain,
  Database,
  Filter,
  Globe,
  LayoutGrid,
  MessageSquare,
  MousePointer2,
  Send,
  Server,
  Sparkles,
  Users,
  Utensils,
  Workflow,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "@/lib/i18n/LanguageContext";

// Previews "vivos" das soluções (Home e /services). Cada um roda UMA sequência
// curta quando entra na tela — cursor, linha destacada, status, progresso,
// fluxo — sem loop. Com prefers-reduced-motion (MotionConfig em AppShell) os
// deslocamentos somem e o estado final aparece direto. Todos são composições
// CONCEITUAIS: só nomes reais (ZLift Manager, Dieta IA, Gemini AI) e formas —
// nenhum dado, número ou métrica.

const EASE = [0.16, 1, 0.3, 1] as const;
const VIEW = { once: true, margin: "-60px" } as const;

function Frame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden rounded-lg border border-border-strong bg-background/70 ${className}`} aria-hidden="true">
      {children}
    </div>
  );
}

function WindowBar({ title }: { title?: string }) {
  return (
    <div className="flex h-7 items-center gap-1.5 border-b border-border px-2.5">
      <span className="h-2 w-2 rounded-full bg-text-muted/30" />
      <span className="h-2 w-2 rounded-full bg-text-muted/30" />
      <span className="h-2 w-2 rounded-full bg-text-muted/30" />
      {title && <span className="ml-2 font-mono text-[10px] text-text-muted">{title}</span>}
    </div>
  );
}

function Bar({ w, strong = false }: { w: string; strong?: boolean }) {
  return <span className={`block h-1.5 rounded-full ${strong ? "bg-text-muted/35" : "bg-surface-muted"}`} style={{ width: w }} />;
}

// Sistema sob medida: menu, filtros, tabela e status. O cursor entra, a
// segunda linha é selecionada e o status dela muda para concluído.
export function SystemPreview() {
  const rows = ["62%", "48%", "70%", "54%"];

  return (
    <Frame>
      <WindowBar />
      <div className="grid grid-cols-[2rem_1fr]">
        <div className="space-y-2 border-r border-border py-3">
          {[LayoutGrid, Users, Filter].map((Icon, index) => (
            <Icon key={index} size={12} strokeWidth={1.75} className={`mx-auto ${index === 0 ? "text-accent" : "text-text-muted"}`} />
          ))}
        </div>

        <div className="relative p-3">
          <div className="mb-2.5 flex items-center gap-1.5">
            <Filter size={11} className="text-text-muted" />
            <span className="h-4 w-10 rounded-full bg-accent/15 ring-1 ring-border-accent" />
            <span className="h-4 w-8 rounded-full bg-surface-muted" />
            <span className="h-4 w-9 rounded-full bg-surface-muted" />
          </div>

          <div className="overflow-hidden rounded-md border border-border">
            {rows.map((w, index) => (
              <motion.div
                key={index}
                className="relative flex items-center gap-2.5 border-b border-border px-2.5 py-2 last:border-b-0"
                initial={index === 1 ? { backgroundColor: "rgba(96,165,250,0)" } : false}
                whileInView={index === 1 ? { backgroundColor: "rgba(96,165,250,0.12)" } : undefined}
                viewport={VIEW}
                transition={{ delay: 1.1, duration: 0.3 }}
              >
                <span className="relative h-2 w-2 shrink-0">
                  <span className={`absolute inset-0 rounded-full ${index === 1 ? "bg-text-muted/50" : index % 2 ? "bg-emerald-400/80" : "bg-accent"}`} />
                  {index === 1 && (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-emerald-400"
                      initial={{ opacity: 0, scale: 0.4 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={VIEW}
                      transition={{ delay: 1.5, duration: 0.35, ease: EASE }}
                    />
                  )}
                </span>
                <Bar w={w} strong />
                <span className="ml-auto h-1.5 w-8 rounded-full bg-surface-muted" />
              </motion.div>
            ))}
          </div>

          <motion.div
            className="absolute left-0 top-0 text-text-primary"
            initial={{ x: 150, y: 120, opacity: 0 }}
            whileInView={{ x: 110, y: 64, opacity: [0, 1, 1, 0] }}
            viewport={VIEW}
            transition={{
              x: { duration: 0.9, ease: EASE, delay: 0.3 },
              y: { duration: 0.9, ease: EASE, delay: 0.3 },
              opacity: { duration: 1.8, times: [0, 0.15, 0.8, 1], delay: 0.3 },
            }}
          >
            <MousePointer2 size={14} fill="currentColor" />
          </motion.div>
        </div>
      </div>
    </Frame>
  );
}

// SaaS: a mesma plataforma servindo várias instâncias — referência ao ZLift
// Manager. As camadas deslizam para a pilha ao entrar na tela.
export function SaasPreview() {
  const modules = [Users, LayoutGrid, Filter, Workflow];

  return (
    <div className="relative h-32" aria-hidden="true">
      {[2, 1, 0].map((layer) => (
        <motion.div
          key={layer}
          className="absolute overflow-hidden rounded-lg border border-border-strong bg-surface"
          style={{ zIndex: 3 - layer, width: "72%" }}
          initial={{ left: "14%", top: 18, opacity: 0 }}
          whileInView={{ left: `${layer * 13}%`, top: layer * 14, opacity: 1 - layer * 0.28 }}
          viewport={VIEW}
          transition={{ duration: 0.7, ease: EASE, delay: 0.15 * (2 - layer) }}
        >
          <WindowBar title={layer === 0 ? "ZLift Manager" : undefined} />
          <div className="flex gap-1.5 p-2.5">
            {modules.map((Icon, index) => (
              <span
                key={index}
                className={`flex h-6 w-6 items-center justify-center rounded-md ${
                  layer === 0 && index === 0 ? "bg-accent/15 text-accent" : "bg-surface-muted text-text-muted"
                }`}
              >
                <Icon size={11} strokeWidth={1.75} />
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// Aplicativo: referência ao Dieta IA (app real com Gemini AI). O botão gera,
// a barra de progresso enche e os cartões do resultado aparecem.
export function AppPreview() {
  return (
    <div className="mx-auto w-40 rounded-[1.6rem] border border-border-strong bg-background/70 p-2" aria-hidden="true">
      <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-text-muted/30" />
      <div className="space-y-2 rounded-2xl bg-surface p-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-text-primary">Dieta IA</span>
          <span className="inline-flex items-center gap-0.5 rounded-full bg-accent/15 px-1.5 py-0.5 text-[8px] text-accent">
            <Sparkles size={8} /> Gemini AI
          </span>
        </div>
        <Bar w="80%" strong />
        <Bar w="55%" />
        <div className="relative h-5 overflow-hidden rounded-md bg-cta/85">
          <motion.span
            className="absolute inset-y-0 left-0 bg-white/25"
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            viewport={VIEW}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 0.4 }}
          />
        </div>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="flex items-center gap-1.5 rounded-md border border-border bg-background/60 p-1.5"
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEW}
            transition={{ duration: 0.4, ease: EASE, delay: 1.7 + index * 0.15 }}
          >
            <Utensils size={9} className="shrink-0 text-accent" />
            <Bar w={`${70 - index * 12}%`} strong />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Fluxo de IA/automação: entrada → IA → automação → resultado, acendendo em
// sequência. `highlight` destaca a etapa principal da solução.
export function FlowPreview({ highlight = 1 }: { highlight?: number }) {
  const t = useTranslations();
  const icons: LucideIcon[] = [MessageSquare, Brain, Zap, Send];

  return (
    <ol className="grid grid-cols-2 gap-2" aria-hidden="true">
      {t.home.solutions.flow.map((label, index) => {
        const Icon = icons[index];
        const isMain = index === highlight;

        return (
          <motion.li
            key={label}
            className={`flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border px-2.5 py-2 ${isMain ? "border-border-accent bg-accent/10" : "border-border bg-background/60"}`}
            initial={{ opacity: 0.35 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEW}
            transition={{ duration: 0.35, delay: 0.3 + index * 0.35 }}
          >
            <span className={`font-mono text-[9px] ${isMain ? "text-accent" : "text-text-muted"}`}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <Icon size={13} strokeWidth={1.75} className={isMain ? "text-accent" : "text-text-secondary"} />
            {/* Em cartões estreitos o rótulo desce para a linha de baixo em
                vez de ser cortado com reticências. */}
            <span className="min-w-0 text-[11px] font-medium text-text-primary">{label}</span>
          </motion.li>
        );
      })}
    </ol>
  );
}

// Sistema web: janela de navegador com a página montando em sequência.
export function WebPreview() {
  return (
    <Frame>
      <div className="flex h-7 items-center gap-2 border-b border-border px-2.5">
        <Globe size={10} className="text-text-muted" />
        <span className="h-3 flex-1 rounded-full bg-surface-muted" />
      </div>
      <div className="space-y-2.5 p-3">
        <div className="flex items-center justify-between">
          <Bar w="22%" strong />
          <span className="h-3 w-10 rounded-full bg-cta/80" />
        </div>
        <Bar w="75%" strong />
        <Bar w="50%" />
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          {[0, 1, 2].map((index) => (
            <motion.span
              key={index}
              className="h-10 rounded-md border border-border bg-surface"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW}
              transition={{ duration: 0.45, ease: EASE, delay: 0.3 + index * 0.12 }}
            />
          ))}
        </div>
      </div>
    </Frame>
  );
}

// Integrações: serviços ligados a um núcleo; as conexões se desenham uma vez.
export function IntegrationsPreview() {
  const nodes: { Icon: LucideIcon; x: number; y: number }[] = [
    { Icon: Database, x: 18, y: 22 },
    { Icon: Server, x: 82, y: 22 },
    { Icon: MessageSquare, x: 18, y: 78 },
    { Icon: Globe, x: 82, y: 78 },
  ];

  return (
    <div className="relative h-32" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {nodes.map(({ x, y }, index) => (
          <motion.line
            key={index}
            x1={50}
            y1={50}
            x2={x}
            y2={y}
            stroke="var(--border-strong)"
            strokeWidth={0.6}
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={VIEW}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 + index * 0.12 }}
          />
        ))}
      </svg>
      <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-border-accent bg-accent/10 text-accent">
        <Workflow size={16} strokeWidth={1.75} />
      </span>
      {nodes.map(({ Icon, x, y }, index) => (
        <motion.span
          key={index}
          className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-border-strong bg-surface text-text-secondary"
          style={{ left: `${x}%`, top: `${y}%` }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEW}
          transition={{ duration: 0.4, delay: 0.5 + index * 0.12 }}
        >
          <Icon size={13} strokeWidth={1.75} />
        </motion.span>
      ))}
    </div>
  );
}
