"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Building2,
  CodeXml,
  FolderKanban,
  House,
  Layers,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { GlobalControls } from "@/components/layout/GlobalControls";
import { Logo } from "@/components/layout/Logo";
import { DESKTOP_QUERY, MobileMenu } from "@/components/layout/MobileMenu";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import { useSidebarCollapsed } from "@/lib/preferences";
import { isNavItemActive, MAIN_NAV, SECONDARY_NAV } from "@/lib/site";
import type { NavItem } from "@/lib/site";

export const SIDEBAR_ID = "sidebar";

const NAV_ICONS: Record<NavItem["key"], LucideIcon> = {
  home: House,
  services: Layers,
  projects: FolderKanban,
  about: Building2,
  contact: MessageSquare,
  skills: CodeXml,
  certificates: Award,
};

function subscribeToDesktop(onChange: () => void) {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// Snapshot do servidor = desktop: o HTML inicial nunca sai com `inert` (que
// travaria a Sidebar fixa até a hidratação). No mobile, antes da hidratação,
// o drawer fechado já está fora da tela e `invisible` via CSS.
function useIsDesktop(): boolean {
  return useSyncExternalStore(
    subscribeToDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => true,
  );
}

type SidebarProps = {
  isDrawerOpen: boolean;
  onCloseDrawer: (restoreFocus?: boolean) => void;
};

// Navegação principal do site.
// - lg+: barra fixa à esquerda (15rem), recolhível para 4rem pelo botão no
//   topo. O estado recolhido fica no atributo data-sidebar do <html>
//   (lib/preferences), aplicado antes do primeiro paint — os estilos
//   "recolhida" são só CSS (variante sidebar-collapsed), sem flash nem
//   deslocamento de layout. Recolhida, cada ícone ganha um tooltip
//   (.sidebar-tooltip em globals.css) no hover e no foco por teclado.
// - < lg: drawer aberto pelo botão da Top Bar; comportamento de foco/Esc/
//   overlay/scroll lock em MobileMenu.
export function Sidebar({ isDrawerOpen, onCloseDrawer }: SidebarProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const isDesktop = useIsDesktop();
  const [isCollapsed, setCollapsed] = useSidebarCollapsed();

  const isHiddenDrawer = !isDesktop && !isDrawerOpen;
  const collapseLabel = isCollapsed ? t.sidebar.expand : t.sidebar.collapse;

  // WCAG 1.4.13: Esc dispensa o tooltip visível sem mover o ponteiro nem o
  // foco; ele volta no próximo foco ou quando o ponteiro sai da barra.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape") panel.dataset.tooltips = "off";
    };
    const restore = () => {
      delete panel.dataset.tooltips;
    };

    document.addEventListener("keydown", dismiss);
    panel.addEventListener("focusin", restore);
    panel.addEventListener("pointerleave", restore);
    return () => {
      document.removeEventListener("keydown", dismiss);
      panel.removeEventListener("focusin", restore);
      panel.removeEventListener("pointerleave", restore);
    };
  }, []);

  function renderLink(item: NavItem) {
    return (
      <SidebarLink
        key={item.href}
        href={item.href}
        label={t.nav[item.key]}
        Icon={NAV_ICONS[item.key]}
        isActive={isNavItemActive(item.href, pathname)}
        onNavigate={() => onCloseDrawer(false)}
      />
    );
  }

  return (
    <>
      <MobileMenu
        isOpen={isDrawerOpen}
        onClose={onCloseDrawer}
        panelRef={panelRef}
      />

      <div
        id={SIDEBAR_ID}
        ref={panelRef}
        inert={isHiddenDrawer || undefined}
        // visibility só entra na transição ao FECHAR (espera o slide terminar
        // para esconder). Ao abrir, fica visível no mesmo frame — senão o
        // painel ainda estaria hidden quando o MobileMenu move o foco.
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,85vw)] flex-col border-r border-border bg-background duration-200 lg:bg-(--sidebar-bg) ease-out motion-reduce:transition-none lg:visible lg:z-30 lg:w-(--sidebar-width) lg:translate-x-0 ${
          isDrawerOpen
            ? "visible translate-x-0 transition-[transform,width]"
            : "invisible -translate-x-full transition-[transform,visibility,width]"
        }`}
      >
        <div className="group/brand relative flex h-(--topbar-height) shrink-0 items-center justify-between gap-2 border-b border-border px-4 lg:pr-2 lg:sidebar-collapsed:justify-center lg:sidebar-collapsed:px-0">
          <Logo
            priority
            onClick={() => onCloseDrawer(false)}
            nameClassName="lg:sidebar-collapsed:sr-only"
          />

          {/* Recolher/expandir no topo (desktop). Recolhida, o botão aparece
              sobre o símbolo da ZTech no hover ou no foco por teclado. Sem
              aria-label: o nome vem do texto oculto (padrão das suítes E2E). */}
          <div className="sidebar-tip sidebar-tip--always hidden lg:block lg:sidebar-collapsed:absolute lg:sidebar-collapsed:inset-0 lg:sidebar-collapsed:flex lg:sidebar-collapsed:items-center lg:sidebar-collapsed:justify-center">
            <button
              type="button"
              aria-controls={SIDEBAR_ID}
              aria-expanded={!isCollapsed}
              onClick={() => setCollapsed(!isCollapsed)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-[color,background-color,opacity] duration-150 hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none lg:sidebar-collapsed:bg-surface-strong lg:sidebar-collapsed:text-text-primary lg:sidebar-collapsed:opacity-0 lg:sidebar-collapsed:group-hover/brand:opacity-100 lg:sidebar-collapsed:focus-visible:opacity-100"
            >
              {isCollapsed ? (
                <PanelLeftOpen size={16} strokeWidth={1.75} aria-hidden="true" />
              ) : (
                <PanelLeftClose size={16} strokeWidth={1.75} aria-hidden="true" />
              )}
              <span className="sr-only">{collapseLabel}</span>
            </button>
            <SidebarTooltip label={collapseLabel} />
          </div>

          <button
            type="button"
            aria-label={t.topbar.closeMenu}
            onClick={() => onCloseDrawer(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-text-secondary transition-colors hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          >
            <X size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        <nav
          aria-label={t.sidebar.navLabel}
          // Recolhida: sem rolagem, para os tooltips poderem sair da barra
          // (os 7 itens cabem em qualquer altura de desktop).
          className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3 lg:sidebar-collapsed:overflow-x-visible lg:sidebar-collapsed:overflow-y-visible"
        >
          <ul className="space-y-0.5">{MAIN_NAV.map(renderLink)}</ul>

          <div className="mt-6">
            <p className="px-3 pb-1.5 font-mono text-[11px] uppercase tracking-wider text-text-muted lg:sidebar-collapsed:sr-only">
              {t.sidebar.moreTitle}
            </p>
            <div
              aria-hidden="true"
              className="mx-3 mb-2 hidden h-px bg-border lg:sidebar-collapsed:block"
            />
            <ul className="space-y-0.5">{SECONDARY_NAV.map(renderLink)}</ul>
          </div>
        </nav>

        <div className="shrink-0 border-t border-border p-2">
          <GlobalControls />
        </div>
      </div>
    </>
  );
}

type SidebarLinkProps = {
  href: string;
  label: string;
  Icon: LucideIcon;
  isActive: boolean;
  onNavigate: () => void;
};

// Rótulo visual da Sidebar recolhida. Decorativo para leitores de tela (o
// nome acessível já vem do texto oculto do link/botão); fica colado ao item
// para o ponteiro poder passar sobre ele sem que suma (WCAG 1.4.13).
function SidebarTooltip({ label }: { label: string }) {
  return (
    <span aria-hidden="true" className="sidebar-tooltip">
      <span className="sidebar-tooltip__label">{label}</span>
    </span>
  );
}

function SidebarLink({ href, label, Icon, isActive, onNavigate }: SidebarLinkProps) {
  return (
    <li className="sidebar-tip relative">
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        onClick={onNavigate}
        className={`relative flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:h-9 lg:sidebar-collapsed:justify-center lg:sidebar-collapsed:px-0 ${
          isActive
            ? "bg-surface-muted font-medium text-text-primary"
            : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
        }`}
      >
        {/* Indicador do item ativo — desliza entre itens ao navegar
            (sem movimento com prefers-reduced-motion, via MotionConfig). */}
        {isActive && (
          <motion.span
            layoutId="sidebar-active-indicator"
            aria-hidden="true"
            className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-accent"
            transition={{ type: "spring", stiffness: 500, damping: 40 }}
          />
        )}
        <Icon
          size={16}
          strokeWidth={1.75}
          aria-hidden="true"
          className={`shrink-0 ${isActive ? "text-accent" : ""}`}
        />
        <span className="truncate lg:sidebar-collapsed:sr-only">{label}</span>
      </Link>
      <SidebarTooltip label={label} />
    </li>
  );
}
