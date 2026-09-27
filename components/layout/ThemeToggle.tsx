"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import { useTheme } from "@/lib/preferences";

// Botão isolado de alternância de tema. O estado vem de useTheme (atributo
// data-theme no <html>, aplicado antes do primeiro paint pelo script de
// app/layout.tsx) — o mesmo usado pelo menu ⋮ (GlobalControls), então
// qualquer número de controles de tema fica sempre sincronizado.
export function ThemeToggle() {
  const [theme, setTheme] = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const t = useTranslations();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? t.globalControls.themeToLight : t.globalControls.themeToDark}
      title={isDark ? t.globalControls.themeToLight : t.globalControls.themeToDark}
      className="
        relative flex h-10 w-10 items-center justify-center overflow-hidden
        rounded-lg border border-border bg-surface
        text-text-secondary
        transition-colors duration-150
        hover:border-border-strong hover:text-text-primary
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
      "
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={
            prefersReducedMotion
              ? false
              : { opacity: 0, rotate: -90, scale: 0.6 }
          }
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={
            prefersReducedMotion
              ? undefined
              : { opacity: 0, rotate: 90, scale: 0.6 }
          }
          transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: "easeOut" }}
          className="flex"
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
