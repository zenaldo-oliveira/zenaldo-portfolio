"use client";

import { createHtmlPreference } from "@/lib/preferences/htmlPreference";

export type Theme = "dark" | "light";

// Chaves de localStorage e atributos compartilhados com o script anti-flash
// de app/layout.tsx — manter sincronizados.
export const THEME_STORAGE_KEY = "theme";
export const SIDEBAR_STORAGE_KEY = "sidebar-collapsed";

export const useTheme = createHtmlPreference<Theme>({
  attribute: "data-theme",
  storageKey: THEME_STORAGE_KEY,
  fallback: "dark",
  parse: (value) => (value === "light" ? "light" : "dark"),
  serialize: (value) => value,
});

type SidebarState = "expanded" | "collapsed";

const useSidebarState = createHtmlPreference<SidebarState>({
  attribute: "data-sidebar",
  storageKey: SIDEBAR_STORAGE_KEY,
  fallback: "expanded",
  parse: (value) => (value === "collapsed" ? "collapsed" : "expanded"),
  // Mesma chave da Sidebar antiga; o script anti-flash também aceita o valor
  // legado "true", preservando a preferência de quem já recolheu a barra.
  serialize: (value) => (value === "collapsed" ? "collapsed" : null),
});

export function useSidebarCollapsed(): [boolean, (collapsed: boolean) => void] {
  const [state, setState] = useSidebarState();
  return [
    state === "collapsed",
    (collapsed) => setState(collapsed ? "collapsed" : "expanded"),
  ];
}
