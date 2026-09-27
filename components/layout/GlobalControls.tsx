"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, EllipsisVertical, Moon, PanelLeftClose, Sun } from "lucide-react";
import { LANGUAGES } from "@/components/layout/LanguageSelector";
import { useLanguage, useTranslations } from "@/lib/i18n/LanguageContext";
import { useSidebarCollapsed, useTheme } from "@/lib/preferences";

const ITEM_SELECTOR = '[role="menuitemradio"], [role="menuitemcheckbox"]';

const ITEM_CLASS =
  "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm text-text-secondary outline-none transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary focus-visible:bg-surface-muted focus-visible:text-text-primary aria-checked:text-text-primary";

// Itens visíveis na ordem do DOM (o grupo "Exibição" some abaixo de lg via
// CSS e não pode receber foco pelas setas).
function getVisibleItems(menu: HTMLElement | null): HTMLElement[] {
  if (!menu) return [];
  return Array.from(menu.querySelectorAll<HTMLElement>(ITEM_SELECTOR)).filter(
    (item) => item.getClientRects().length > 0,
  );
}

// Controles globais do site (idioma, tema e preferências de exibição) no
// menu ⋮ da base da Sidebar. Padrão WAI-ARIA "menu button": setas/Home/End
// navegam, Esc fecha e devolve o foco ao botão, Tab ou clique fora fecham.
// Escolher uma opção mantém o menu aberto — é um painel de preferências.
export function GlobalControls() {
  const t = useTranslations();
  const { language, setLanguage } = useLanguage();
  const [theme, setTheme] = useTheme();
  const [isCollapsed, setCollapsed] = useSidebarCollapsed();
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const languageLabelId = useId();
  const themeLabelId = useId();
  const displayLabelId = useId();

  function close(restoreFocus: boolean) {
    setIsOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  }

  useEffect(() => {
    if (!isOpen) return;

    // Foco inicial no item marcado do primeiro grupo (idioma atual).
    const items = getVisibleItems(menuRef.current);
    const checked = items.find(
      (item) => item.getAttribute("aria-checked") === "true",
    );
    (checked ?? items[0])?.focus();

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  function handleMenuKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const items = getVisibleItems(menuRef.current);
    const index = items.indexOf(document.activeElement as HTMLElement);

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        items[(index + 1) % items.length]?.focus();
        break;
      case "ArrowUp":
        event.preventDefault();
        items[(index - 1 + items.length) % items.length]?.focus();
        break;
      case "Home":
        event.preventDefault();
        items[0]?.focus();
        break;
      case "End":
        event.preventDefault();
        items[items.length - 1]?.focus();
        break;
      case "Escape":
        // preventDefault sinaliza ao drawer mobile (MobileMenu) que este Esc
        // já foi tratado — só o menu fecha, não o drawer inteiro.
        event.preventDefault();
        close(true);
        break;
      case "Tab":
        close(false);
        break;
    }
  }

  function handleTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={handleTriggerKeyDown}
        title={t.preferences.trigger}
        className="flex h-9 w-full items-center gap-3 rounded-md px-3 text-sm text-text-secondary transition-colors duration-150 hover:bg-surface-muted hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-expanded:bg-surface-muted aria-expanded:text-text-primary lg:sidebar-collapsed:justify-center lg:sidebar-collapsed:px-0"
      >
        <EllipsisVertical size={16} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
        <span className="truncate lg:sidebar-collapsed:sr-only">
          {t.preferences.trigger}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label={t.preferences.trigger}
            onKeyDown={handleMenuKeyDown}
            initial={{ opacity: 0, scale: 0.97, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 4 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            className="absolute bottom-full left-0 z-50 mb-2 w-56 origin-bottom-left rounded-xl border border-border bg-surface-overlay p-1.5 shadow-[0_8px_24px_rgba(2,6,23,0.18)] backdrop-blur-md lg:sidebar-collapsed:bottom-0 lg:sidebar-collapsed:left-full lg:sidebar-collapsed:mb-0 lg:sidebar-collapsed:ml-2 lg:sidebar-collapsed:w-60"
          >
            <MenuGroup labelId={languageLabelId} label={t.preferences.language}>
              {LANGUAGES.map((item) => (
                <MenuItem
                  key={item.code}
                  role="menuitemradio"
                  isChecked={language === item.code}
                  onSelect={() => setLanguage(item.code)}
                >
                  <span lang={item.code} className="flex-1">
                    {item.label}
                  </span>
                  <span className="font-mono text-[11px] uppercase text-text-muted">
                    {item.code}
                  </span>
                </MenuItem>
              ))}
            </MenuGroup>

            <MenuSeparator />

            <MenuGroup labelId={themeLabelId} label={t.preferences.theme}>
              <MenuItem
                role="menuitemradio"
                isChecked={theme === "light"}
                onSelect={() => setTheme("light")}
              >
                <Sun size={14} strokeWidth={1.75} aria-hidden="true" />
                <span className="flex-1">{t.preferences.themeLight}</span>
              </MenuItem>
              <MenuItem
                role="menuitemradio"
                isChecked={theme === "dark"}
                onSelect={() => setTheme("dark")}
              >
                <Moon size={14} strokeWidth={1.75} aria-hidden="true" />
                <span className="flex-1">{t.preferences.themeDark}</span>
              </MenuItem>
            </MenuGroup>

            {/* Recolher a Sidebar só existe no layout desktop (lg+). */}
            <div className="hidden lg:block">
              <MenuSeparator />

              <MenuGroup labelId={displayLabelId} label={t.preferences.display}>
                <MenuItem
                  role="menuitemcheckbox"
                  isChecked={isCollapsed}
                  onSelect={() => setCollapsed(!isCollapsed)}
                >
                  <PanelLeftClose size={14} strokeWidth={1.75} aria-hidden="true" />
                  <span className="flex-1">{t.sidebar.collapse}</span>
                </MenuItem>
              </MenuGroup>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuGroup({
  labelId,
  label,
  children,
}: {
  labelId: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div role="group" aria-labelledby={labelId}>
      <div
        id={labelId}
        role="presentation"
        className="px-2 pb-1 pt-1.5 font-mono text-[11px] uppercase tracking-wider text-text-muted"
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function MenuItem({
  role,
  isChecked,
  onSelect,
  children,
}: {
  role: "menuitemradio" | "menuitemcheckbox";
  isChecked: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={isChecked}
      tabIndex={-1}
      onClick={onSelect}
      className={ITEM_CLASS}
    >
      {children}
      <Check
        size={14}
        strokeWidth={2}
        aria-hidden="true"
        className={isChecked ? "text-accent" : "invisible"}
      />
    </button>
  );
}

function MenuSeparator() {
  return <div role="separator" className="-mx-1.5 my-1.5 h-px bg-border" />;
}
