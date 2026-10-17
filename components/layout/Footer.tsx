"use client";

import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Logo } from "@/components/layout/Logo";
import { buildWhatsAppUrl } from "@/lib/contact/whatsapp";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import { MAIN_NAV, SECONDARY_NAV, SITE_NAME, SOCIAL_LINKS } from "@/lib/site";

const LINK_CLASS =
  "rounded text-sm text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const TITLE_CLASS =
  "font-mono text-[11px] uppercase tracking-wider text-text-muted";

const SOCIAL_CLASS =
  "flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-secondary transition-colors hover:border-border-strong hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const SOCIALS = [
  { label: "LinkedIn", href: SOCIAL_LINKS.linkedin, Icon: FaLinkedin },
  { label: "GitHub", href: SOCIAL_LINKS.github, Icon: FaGithub },
] as const;

// Rodapé global, compacto. Sem CNPJ/e-mail enquanto não existirem dados
// reais — adicionar aqui quando forem definidos.
export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-(--sidebar-bg) px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-10 sm:px-6">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div className="col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-secondary">
            {t.brand.description}
          </p>
          <ul aria-label={t.footer.socialTitle} className="mt-4 flex gap-2">
            {SOCIALS.map(({ label, href, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={SOCIAL_CLASS}>
                  <Icon size={15} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label={t.footer.navTitle}>
          <p className={TITLE_CLASS}>{t.footer.navTitle}</p>
          <ul className="mt-3 space-y-2.5">
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={LINK_CLASS}>
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t.footer.moreTitle}>
          <p className={TITLE_CLASS}>{t.footer.moreTitle}</p>
          <ul className="mt-3 space-y-2.5">
            {SECONDARY_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={LINK_CLASS}>
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 sm:col-span-1">
          <p className={TITLE_CLASS}>{t.footer.contactTitle}</p>
          <ul className="mt-3 space-y-2.5">
            <li>
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t.cta.whatsappAriaLabel}
                className={LINK_CLASS}
              >
                {t.footer.whatsapp}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* pr no mobile: o botão flutuante do WhatsApp fica no canto inferior
          direito e não pode cobrir a última linha do rodapé. */}
      <div className="mx-auto mt-8 w-full max-w-6xl border-t border-border pr-20 pt-5 sm:pr-0">
        <p className="text-xs text-text-muted">
          © {year} {SITE_NAME}. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
