"use client";

import { usePathname } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import type { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useTranslations } from "@/lib/i18n/LanguageContext";

// Estrutura de todas as páginas: Sidebar (fixa no desktop, drawer no mobile)
// + coluna de conteúdo com Top Bar, <main> e Footer. Guarda o estado do
// drawer, compartilhado entre o botão da Top Bar e o painel da Sidebar.
// MotionConfig faz toda animação do framer-motion respeitar
// prefers-reduced-motion (a regra global do CSS não alcança animações JS).
export function AppShell({ children }: { children: ReactNode }) {
  const t = useTranslations();
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Fecha o drawer ao trocar de página.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setIsDrawerOpen(false);
  }

  const closeDrawer = useCallback((restoreFocus = true) => {
    setIsDrawerOpen(false);
    if (restoreFocus) menuButtonRef.current?.focus();
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:rounded-md focus:bg-cta focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        {t.topbar.skipToContent}
      </a>

      <Sidebar isDrawerOpen={isDrawerOpen} onCloseDrawer={closeDrawer} />

      <div className="flex min-h-screen flex-col transition-[padding-left] duration-200 ease-out motion-reduce:transition-none lg:pl-(--sidebar-width)">
        <Header
          isDrawerOpen={isDrawerOpen}
          onToggleDrawer={() => setIsDrawerOpen((open) => !open)}
          menuButtonRef={menuButtonRef}
        />

        <main id="conteudo" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </main>

        <Footer />
      </div>
    </MotionConfig>
  );
}
