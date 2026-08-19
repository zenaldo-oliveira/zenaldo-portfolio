"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Globe } from "lucide-react";
import { useLanguage, useTranslations } from "@/lib/i18n/LanguageContext";
import type { LanguageCode } from "@/lib/i18n/types";

// Nomes de cada idioma sempre no próprio idioma (convenção padrão de
// seletores de idioma) — não vêm do dicionário, não mudam com a seleção.
const LANGUAGES: { code: LanguageCode; label: string; flag: string }[] = [
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function selectLanguage(code: LanguageCode) {
    setLanguage(code);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={t.globalControls.languageSelector}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        title={t.globalControls.languageSelector}
        className="
          flex h-10 w-10 items-center justify-center
          rounded-xl border border-border bg-surface backdrop-blur-xl
          text-accent
          transition-colors duration-300
          hover:border-cyan-500/40 hover:bg-cyan-500/10
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60
        "
      >
        <Globe size={18} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            aria-label={t.globalControls.languageMenuLabel}
            initial={
              prefersReducedMotion
                ? false
                : { opacity: 0, y: -4, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion ? undefined : { opacity: 0, y: -4, scale: 0.98 }
            }
            transition={{ duration: prefersReducedMotion ? 0 : 0.15, ease: "easeOut" }}
            className="
              absolute right-0 top-12 z-50 w-44 overflow-hidden
              rounded-2xl border border-border bg-surface-overlay backdrop-blur-xl
              shadow-2xl
            "
          >
            {LANGUAGES.map((item) => {
              const isSelected = item.code === language;

              return (
                <button
                  key={item.code}
                  type="button"
                  role="menuitem"
                  aria-current={isSelected ? "true" : undefined}
                  onClick={() => selectLanguage(item.code)}
                  className={`
                    flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm
                    transition-colors duration-200
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60
                    ${
                      isSelected
                        ? "bg-cyan-500/10 text-accent"
                        : "text-text-secondary hover:bg-cyan-500/5 hover:text-text-primary"
                    }
                  `}
                >
                  <span aria-hidden="true">{item.flag}</span>
                  <span className="flex-1">{item.label}</span>
                  {isSelected && <Check size={14} className="text-accent" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
