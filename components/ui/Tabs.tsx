"use client";

import { useId, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type TabItem<T extends string> = {
  id: T;
  label: string;
  panel: ReactNode;
};

type TabsProps<T extends string> = {
  label: string;
  items: readonly TabItem<T>[];
  className?: string;
};

// Abas acessíveis (padrão WAI-ARIA "tabs"): ←/→, Home/End movem e ativam a
// aba; só a aba ativa entra no Tab (roving tabindex). O indicador desliza
// entre as abas e o painel troca com um fade curto — com movimento reduzido,
// a MotionConfig global torna as transições instantâneas.
export function Tabs<T extends string>({ label, items, className = "" }: TabsProps<T>) {
  const baseId = useId();
  const [active, setActive] = useState<T>(items[0].id);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = items.findIndex((item) => item.id === active);

  function select(index: number) {
    const item = items[index];
    if (!item) return;
    setActive(item.id);
    tabRefs.current[index]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const last = items.length - 1;
    const next =
      event.key === "ArrowRight" ? (activeIndex === last ? 0 : activeIndex + 1)
      : event.key === "ArrowLeft" ? (activeIndex === 0 ? last : activeIndex - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : -1;
    if (next === -1) return;
    event.preventDefault();
    select(next);
  }

  // Fallback: se as abas mudarem e a ativa sumir, volta para a primeira.
  const current = items[activeIndex] ?? items[0];

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={handleKeyDown}
        className="relative inline-flex max-w-full gap-1 overflow-x-auto rounded-xl border border-border bg-surface p-1"
      >
        {items.map((item, index) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.id}`}
              aria-selected={isActive}
              // Só o painel ativo está montado: aponta apenas para ele.
              aria-controls={isActive ? `${baseId}-panel-${item.id}` : undefined}
              tabIndex={isActive ? 0 : -1}
              onClick={() => select(index)}
              className={`relative shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isActive ? "font-semibold text-text-primary" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId={`${baseId}-indicator`}
                  aria-hidden="true"
                  // Barra sólida na base: o estado não depende só do fundo translúcido (WCAG 1.4.11).
                  className="absolute inset-0 rounded-lg border border-border-accent bg-accent/10 shadow-[inset_0_-2px_0_var(--accent)]"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              )}
              <span className="relative">{item.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current.id}
          role="tabpanel"
          id={`${baseId}-panel-${current.id}`}
          aria-labelledby={`${baseId}-tab-${current.id}`}
          tabIndex={0}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="mt-8 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        >
          {current.panel}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
