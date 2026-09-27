"use client";

import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { buildWhatsAppUrl } from "@/lib/contact/whatsapp";
import { useTranslations } from "@/lib/i18n/LanguageContext";
import { MAIN_NAV, SECONDARY_NAV, SITE_NAME, SOCIAL_LINKS } from "@/lib/site";

const LINK_CLASS =
  "rounded text-sm text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const TITLE_CLASS =
  "font-mono text-[11px] uppercase tracking-wider text-text-muted";

// Rodapé global. Sem CNPJ/e-mail enquanto não existirem dados reais —
// adicionar aqui quando forem definidos.
export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    // pb extra no mobile: o botão flutuante do WhatsApp fica no canto
    // inferior direito e não pode cobrir a última linha do rodapé.
    <footer className="border-t border-border bg-(--sidebar-bg) px-4 pb-24 pt-12 sm:px-6 sm:pb-10">
      <div className="mx-auto grid w-full max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-text-muted">
            {t.brand.tagline}
          </p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-text-secondary">
            {t.brand.description}
          </p>
        </div>

        <nav aria-label={t.footer.navTitle}>
          <p className={TITLE_CLASS}>{t.footer.navTitle}</p>
          <ul className="mt-4 space-y-3">
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
          <ul className="mt-4 space-y-3">
            {SECONDARY_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={LINK_CLASS}>
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className={TITLE_CLASS}>{t.footer.contactTitle}</p>
          <ul className="mt-4 space-y-3">
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

          <p className={`${TITLE_CLASS} mt-8`}>{t.footer.socialTitle}</p>
          <ul className="mt-4 space-y-3">
            <li>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK_CLASS}
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK_CLASS}
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 w-full max-w-6xl border-t border-border pt-6">
        <p className="text-xs text-text-muted">
          © {year} {SITE_NAME}. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
