"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { dictionaries } from "@/lib/i18n/dictionaries";
import type { Dictionary, LanguageCode } from "@/lib/i18n/types";

const LANGUAGE_STORAGE_KEY = "language";
const DEFAULT_LANGUAGE: LanguageCode = "pt";

type LanguageContextValue = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  t: Dictionary;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);

  // Lê a preferência salva só no client, depois da hidratação (evita mismatch
  // SSR/client, mesmo padrão já usado no Sidebar e no ThemeToggle) — o render
  // inicial (servidor e client) sempre usa o idioma padrão de forma consistente.
  useEffect(() => {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (stored === "pt" || stored === "en" || stored === "es") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLanguageState(stored);
    }
  }, []);

  function setLanguage(next: LanguageCode) {
    setLanguageState(next);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
  }

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t: dictionaries[language] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}

export function useTranslations() {
  return useLanguage().t;
}
