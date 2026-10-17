"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import type { RefObject } from "react";
import { Menu } from "lucide-react";
import { WhatsAppCta } from "@/components/contact/WhatsAppCta";
import { Logo } from "@/components/layout/Logo";
import { SIDEBAR_ID } from "@/components/layout/Sidebar";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import {
  isNavItemActive,
  MAIN_NAV,
  SECONDARY_NAV,
  SITE_NAME,
} from "@/lib/site";

const ALL_NAV = [...MAIN_NAV, ...SECONDARY_NAV];

const SCROLL_THRESHOLD = 8;

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

// Só re-renderiza quando cruza o limite (o snapshot é booleano).
function useIsScrolled(): boolean {
  return useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > SCROLL_THRESHOLD,
    () => false,
  );
}

type HeaderProps = {
  isDrawerOpen: boolean;
  onToggleDrawer: () => void;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
};

// Top Bar: complementa a Sidebar sem duplicar a navegação. Borda inferior
// sempre visível — continua a linha do topo da Sidebar. Transparente no
// topo da página; vidro discreto (translúcido + blur) só após rolar.
// Desktop (lg+): breadcrumb com o contexto da página + CTA. Mobile: botão do
// drawer + logo + CTA (a partir de sm; abaixo disso o botão flutuante do
// WhatsApp cobre a conversão). Idioma e tema ficam no menu ⋮ da Sidebar.
export function Header({ isDrawerOpen, onToggleDrawer, menuButtonRef }: HeaderProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const current = ALL_NAV.find((item) => isNavItemActive(item.href, pathname));
  const isScrolled = useIsScrolled();

  return (
    <header
      className={`sticky top-0 z-20 h-(--topbar-height) border-b border-border transition-[background-color] duration-200 motion-reduce:transition-none ${
        isScrolled ? "bg-(--topbar-bg) backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="flex h-full items-center gap-2 px-4 sm:px-6">
        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={isDrawerOpen}
          aria-controls={SIDEBAR_ID}
          aria-label={isDrawerOpen ? t.topbar.closeMenu : t.topbar.openMenu}
          onClick={onToggleDrawer}
          className="-ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        >
          <Menu size={20} strokeWidth={1.75} aria-hidden="true" />
        </button>

        <Logo className="lg:hidden" />

        <nav aria-label={t.topbar.breadcrumbLabel} className="hidden min-w-0 lg:block">
          <ol className="flex min-w-0 items-center gap-2 text-sm">
            <li className="shrink-0">
              <Link
                href="/"
                className="rounded text-text-muted transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {SITE_NAME}
              </Link>
            </li>
            {current && (
              <>
                <li aria-hidden="true" className="text-text-muted">
                  /
                </li>
                <li aria-current="page" className="truncate font-medium text-text-primary">
                  {t.nav[current.key]}
                </li>
              </>
            )}
          </ol>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {/* Wrapper controla a visibilidade: `hidden` direto no Button
              conflitaria com o `inline-flex` base dele. */}
          <div className="hidden sm:block">
            <WhatsAppCta
              label={t.cta.talk}
              ariaLabel={t.cta.whatsappAriaLabel}
              size="sm"
              showArrow={false}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
