"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

export const DESKTOP_QUERY = "(min-width: 1024px)"; // mesmo breakpoint de lg:

const FOCUSABLE =
  'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';

function getFocusables(panel: HTMLElement): HTMLElement[] {
  return Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) => element.getClientRects().length > 0,
  );
}

type MobileMenuProps = {
  isOpen: boolean;
  // restoreFocus=false quando o fechamento vem de navegação (o foco natural
  // já vai para outro lugar).
  onClose: (restoreFocus?: boolean) => void;
  // Painel do drawer — a própria Sidebar (components/layout/Sidebar.tsx).
  panelRef: RefObject<HTMLElement | null>;
};

// Comportamento do drawer mobile da Sidebar (< lg): overlay clicável e,
// enquanto aberto, foco preso dentro do painel, Esc fecha e devolve o foco ao
// botão da Top Bar, scroll da página travado. Ao crescer para o layout desktop
// o drawer fecha sozinho (a Sidebar passa a ser fixa).
export function MobileMenu({ isOpen, onClose, panelRef }: MobileMenuProps) {
  useEffect(() => {
    if (!isOpen) return;

    const panel = panelRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Um frame depois: o painel acabou de sair de visibility:hidden e ainda
    // não aceitaria foco no mesmo tick.
    const focusFrame = requestAnimationFrame(() => {
      if (panel) getFocusables(panel)[0]?.focus();
    });

    function handleKeyDown(event: KeyboardEvent) {
      // defaultPrevented: o Esc já foi tratado por um menu interno (⋮).
      if (event.key === "Escape" && !event.defaultPrevented) {
        onClose(true);
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      const focusables = getFocusables(panel);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;

      if (!panel.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    const desktopQuery = window.matchMedia(DESKTOP_QUERY);
    function handleDesktopChange(event: MediaQueryListEvent) {
      if (event.matches) onClose(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    desktopQuery.addEventListener("change", handleDesktopChange);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      desktopQuery.removeEventListener("change", handleDesktopChange);
    };
  }, [isOpen, onClose, panelRef]);

  return (
    // Clique fora: a área escurecida ao lado do drawer fecha o menu.
    <div
      aria-hidden="true"
      onClick={() => onClose(true)}
      className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-200 motion-reduce:transition-none lg:hidden ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    />
  );
}
