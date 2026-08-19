"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useTranslations } from "@/lib/i18n/LanguageContext";

import {
  Menu,
  X,
  Home,
  User,
  Briefcase,
  Wrench,
  Award,
  FileText,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const COLLAPSE_STORAGE_KEY = "sidebar-collapsed";
const COLLAPSED_WIDTH = "5rem"; // 80px — mesmo valor de w-20, usado no <style> abaixo

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);
  const t = useTranslations();

  // Fecha o menu mobile ao trocar de página
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setIsOpen(false);
  }

  // Lê a preferência salva só no client, depois da hidratação (evita mismatch SSR/client).
  // Sincronizar com localStorage (sistema externo) exige setState pós-montagem — não há
  // como ler localStorage durante a renderização, que também roda no servidor.
  useEffect(() => {
    const stored = window.localStorage.getItem(COLLAPSE_STORAGE_KEY);

    if (stored === "true") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsCollapsed(true);
    }
  }, []);

  // Sincroniza o estado com <body> (para o <main> reagir via CSS) e persiste a escolha.
  useEffect(() => {
    document.body.classList.toggle("sidebar-collapsed", isCollapsed);
    window.localStorage.setItem(COLLAPSE_STORAGE_KEY, String(isCollapsed));
  }, [isCollapsed]);

  const menuItems = [
    {
      href: "/",
      label: t.nav.home,
      icon: Home,
    },
    {
      href: "/about",
      label: t.nav.about,
      icon: User,
    },
    {
      href: "/services",
      label: t.nav.services,
      icon: Wrench,
    },
    {
      href: "/projects",
      label: t.nav.projects,
      icon: Briefcase,
    },
    {
      href: "/skills",
      label: t.nav.skills,
      icon: Award,
    },
    {
      href: "/certificates",
      label: t.nav.certificates,
      icon: FileText,
    },
    {
      href: "/contact",
      label: t.nav.contact,
      icon: Mail,
    },
  ];

  return (
    <>
      {/* Faz o <main> (definido em app/layout.tsx) respeitar a largura recolhida
          no desktop, sem precisar alterar layout.tsx nem globals.css.
          Também esconde o indicador visual da barra de rolagem da Sidebar
          SOMENTE quando recolhida no desktop — o scroll continua funcional
          (overflow-y-auto nunca vira "hidden"), então nenhum ícone fica
          inacessível em viewports muito baixas; só o traço cinza some. */}
      <style>{`
        @media (min-width: 768px) {
          main {
            transition: margin-left 300ms ease;
          }
          body.sidebar-collapsed main {
            margin-left: ${COLLAPSED_WIDTH};
          }
          body.sidebar-collapsed .sidebar-scroll {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          body.sidebar-collapsed .sidebar-scroll::-webkit-scrollbar {
            display: none;
          }
        }
      `}</style>

      {/* BOTÃO MENU MOBILE */}
      <button
        type="button"
        aria-label="Abrir menu"
        onClick={() => setIsOpen(true)}
        className="
            fixed
            left-4
            top-4
            z-50
            rounded-2xl
            border
            border-border-accent
            bg-surface-strong/90
            p-3
            text-accent
            backdrop-blur-xl
            shadow-[0_0_20px_rgba(6,182,212,0.20)]
            transition-all
            duration-300
            hover:scale-105
            hover:border-cyan-500/50
            hover:bg-cyan-500/10
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-cyan-500/60
            md:hidden
          "
      >
        <Menu
          size={22}
          strokeWidth={2.5}
          className="transition-transform duration-300 hover:rotate-90"
        />
      </button>

      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
        sidebar-scroll
        fixed left-0 top-0 z-50 h-screen w-[280px]
        border-r border-border
        bg-surface-strong
        flex flex-col
        overflow-y-auto overflow-x-hidden
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        ${isCollapsed ? "md:w-20" : "md:w-[280px]"}
        md:transition-[width]
      `}
      >
        {/* BOTÃO FECHAR (mobile) */}
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setIsOpen(false)}
          className="
            absolute right-4 top-4
            flex h-10 w-10 items-center justify-center
            rounded-full bg-zinc-800/80
            text-white
            transition-all duration-300
            hover:rotate-180
            hover:bg-red-500
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-cyan-500/60
            md:hidden
          "
        >
          <X size={20} />
        </button>

        {/* TOGGLE EXPANDIR/RECOLHER (desktop) — no topo, junto ao cabeçalho */}
        <div
          className={`hidden md:flex px-3 pt-3 ${
            isCollapsed ? "justify-center" : "justify-end"
          }`}
        >
          <button
            type="button"
            aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
            aria-expanded={!isCollapsed}
            onClick={() => setIsCollapsed((prev) => !prev)}
            className="
              flex h-7 w-7 items-center justify-center
              rounded-lg
              text-cyan-400
              transition-all duration-300
              hover:bg-cyan-500/10 hover:text-cyan-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60
            "
          >
            {isCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>
        </div>

        {/* PERFIL */}
        <div
          className={`flex flex-col items-center ${isCollapsed ? "p-4" : "p-8"}`}
        >
          <Image
            src="/projects/logo-ztech.png"
            alt="ZTech Solutions"
            width={150}
            height={150}
            priority
            className={`
      rounded-full
      border-2
      border-cyan-400/40
      shadow-[0_0_40px_rgba(34,211,238,0.6)]
      transition-all
      duration-300
      hover:scale-105
      ${isCollapsed ? "h-10 w-10" : "h-[150px] w-[150px]"}
    `}
          />

          <div className={isCollapsed ? "sr-only" : ""}>
            <p className="mt-4 text-center text-xl font-bold text-text-primary">
              ZTech Solutions
            </p>

            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-accent">
              {t.sidebar.tagline}
            </p>

            <div className="mt-3 flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              {t.sidebar.availableForProjects}
            </div>

            <p className="mt-4 text-center text-sm leading-relaxed text-text-muted">
              {t.sidebar.description}
            </p>
          </div>
        </div>

        {/* MENU */}
        <nav className={isCollapsed ? "flex-1 px-2 pb-6" : "flex-1 px-6 pb-6"}>
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    title={item.label}
                    className={`
          flex items-center gap-3
          rounded-lg px-4 py-3
          transition-all duration-300
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60
          ${isCollapsed ? "justify-center" : ""}
          ${
            pathname === item.href
              ? "border border-cyan-500 bg-cyan-500/20 text-accent"
              : item.href === "/contact"
                ? "bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
                : "text-text-secondary hover:bg-cyan-500/10 hover:text-text-primary"
          }
        `}
                  >
                    <Icon size={18} />
                    <span className={isCollapsed ? "sr-only" : ""}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* RODAPÉ */}
        <div
          className={`mt-auto flex w-full border-t border-border p-4 ${
            isCollapsed ? "flex-col items-center gap-2" : "justify-center gap-2"
          }`}
        >
          <Link
            href="https://www.linkedin.com/in/zenaldo-pereira-oliveira/"
            target="_blank"
            title="LinkedIn"
            aria-label="LinkedIn"
            className={`
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#0A66C2]
              text-sm
              font-semibold
              text-white
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-[#004182]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60
              ${isCollapsed ? "h-10 w-10" : "w-[85px] px-4 py-2"}
            `}
          >
            {isCollapsed ? <FaLinkedin size={18} /> : "LinkedIn"}
          </Link>

          <Link
            href="https://github.com/zenaldo-oliveira"
            target="_blank"
            title="GitHub"
            aria-label="GitHub"
            className={`
          flex
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-[#F4F2EE]/20
          bg-[#F4F2EE]/10
          text-sm
          font-medium
          text-[#F4F2EE]
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-[#F4F2EE]/50
          hover:bg-[#F4F2EE]/15
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60
          ${isCollapsed ? "h-10 w-10" : "w-[85px] px-3 py-2"}
        `}
          >
            {isCollapsed ? <FaGithub size={18} /> : "GitHub"}
          </Link>
        </div>
      </aside>
    </>
  );
}
