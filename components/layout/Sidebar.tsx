"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

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
} from "lucide-react";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Fecha o menu ao trocar de página
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const menuItems = [
    {
      href: "/",
      label: "Home",
      icon: Home,
    },
    {
      href: "/about",
      label: "Sobre",
      icon: User,
    },
    {
      href: "/projects",
      label: "Projetos",
      icon: Briefcase,
    },
    {
      href: "/blog",
      label: "Blog",
      icon: BookOpen,
    },
    {
      href: "/services",
      label: "Serviços",
      icon: Wrench,
    },
    {
      href: "/skills",
      label: "Habilidades",
      icon: Award,
    },
    {
      href: "/certificates",
      label: "Certificados",
      icon: FileText,
    },
    {
      href: "/contact",
      label: "Contato",
      icon: Mail,
    },
  ];

  return (
    <>
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
            border-cyan-500/20
            bg-[#0f172a]/90
            p-3
            text-cyan-400
            backdrop-blur-xl
            shadow-[0_0_20px_rgba(6,182,212,0.20)]
            transition-all
            duration-300
            hover:scale-105
            hover:border-cyan-500/50
            hover:bg-cyan-500/10
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
        fixed left-0 top-0 z-50 h-screen w-[280px]
        border-r border-zinc-800
        bg-[#0f172a]
        flex flex-col
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
      >
        {/* BOTÃO FECHAR */}
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
            md:hidden
          "
        >
          <X size={20} />
        </button>

        {/* PERFIL */}
        <div className="flex flex-col items-center p-8">
          <Image
            src="/profile.jpg"
            alt="Zenaldo Oliveira"
            width={120}
            height={120}
            className="
          rounded-full
          border-2
          border-cyan-400
          shadow-lg
          shadow-cyan-500/30
        "
          />

          <h1 className="mt-4 text-center text-xl font-bold text-white">
            Zenaldo Oliveira
          </h1>

          <p className="mt-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
            Full Stack Developer
          </p>

          <p className="mt-4 text-center text-sm leading-relaxed text-zinc-300">
            Especialista em React, Next.js, Inteligência Artificial e automações
            para empresas.
          </p>
        </div>

        {/* MENU */}
        <nav className="flex-1 overflow-y-auto px-6 pb-6">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
    flex items-center gap-3
    rounded-lg px-4 py-3
    transition-all duration-300
    ${
      pathname === item.href
        ? "border border-cyan-500 bg-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/10"
        : "text-zinc-200 hover:bg-cyan-500/10 hover:text-white"
    }
  `}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* RODAPÉ */}
        <div className="mt-auto flex w-full justify-center gap-2 p-4">
          <Link
            href="https://linkedin.com/in/seu-link"
            target="_blank"
            className="
              flex
              w-[85px]
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#0A66C2]
              px-4
              py-2
              text-sm
              font-semibold
              text-white
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-[#004182]
            "
          >
            LinkedIn
          </Link>

          <Link
            href="https://github.com/zenaldo-oliveira"
            target="_blank"
            className="
          flex
          w-[85px]
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-[#F4F2EE]/20
          bg-[#F4F2EE]/10
          px-3
          py-2
          text-sm
          font-medium
          text-[#F4F2EE]
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-[#F4F2EE]/50
          hover:bg-[#F4F2EE]/15
        "
          >
            GitHub
          </Link>
        </div>
      </aside>
    </>
  );
}
