import Image from "next/image";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

type LogoProps = {
  className?: string;
  // Classes do nome em texto (ex.: esconder na Sidebar recolhida).
  nameClassName?: string;
  onClick?: () => void;
  // Só o logo acima da dobra deve carregar com prioridade.
  priority?: boolean;
};

// Símbolo "Z" recortado do logo oficial (public/projects/logo-ztech.png) +
// nome da empresa em texto — o logo completo tem textos ilegíveis em
// tamanhos pequenos.
export function Logo({
  className = "",
  nameClassName = "",
  onClick,
  priority = false,
}: LogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label={SITE_NAME}
      className={`inline-flex min-w-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
    >
      <Image
        src="/brand/ztech-mark.png"
        alt=""
        width={28}
        height={28}
        priority={priority}
        className="h-7 w-7 shrink-0 rounded-md"
      />
      <span
        className={`truncate text-[15px] font-semibold tracking-tight text-text-primary ${nameClassName}`}
      >
        {SITE_NAME}
      </span>
    </Link>
  );
}
