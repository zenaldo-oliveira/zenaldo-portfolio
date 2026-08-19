"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "@/lib/i18n/LanguageContext";

const THEME_STORAGE_KEY = "theme";

type Theme = "dark" | "light";

// Os tokens de tema (globals.css) e a conversão para classes baseadas em
// token cobrem, por enquanto, Sidebar, Controles Globais e Home — as demais
// páginas ainda usam cor fixa e não reagem ao data-theme ainda.
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const prefersReducedMotion = useReducedMotion();
  const t = useTranslations();

  // Lê a preferência salva só no client, depois da hidratação (evita mismatch
  // SSR/client) — o <script> bloqueante em app/layout.tsx já aplicou o
  // data-theme correto no <html> antes do primeiro paint; isto só sincroniza
  // o estado do React (e o ícone) com o que já foi decidido.
  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (stored === "light" || stored === "dark") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(stored);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? t.globalControls.themeToLight : t.globalControls.themeToDark}
      title={isDark ? t.globalControls.themeToLight : t.globalControls.themeToDark}
      className="
        relative flex h-10 w-10 items-center justify-center overflow-hidden
        rounded-xl border border-border bg-surface backdrop-blur-xl
        text-accent
        transition-colors duration-300
        hover:border-cyan-500/40 hover:bg-cyan-500/10
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60
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
