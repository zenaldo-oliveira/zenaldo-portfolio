
// Domínio oficial do site. A Vercel redireciona o domínio sem "www" para esta
// URL (308), então canonical, Open Graph, sitemap e robots devem usar sempre
// esta forma — nunca uma URL que responde com redirecionamento.
export const SITE_URL = "https://www.zenaldodev.com.br";

export const SITE_NAME = "ZTech Solutions";

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/in/zenaldo-pereira-oliveira/",
  github: "https://github.com/zenaldo-oliveira",
} as const;

// Rotas reais do site. `key` indexa t.nav (rótulos traduzidos). A Sidebar,
// a Top Bar (breadcrumb) e o Footer leem daqui — nunca duplicar a lista.

// Menu principal da Sidebar (vitrine comercial).
export const MAIN_NAV = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/plans", key: "plans" },
  { href: "/how-it-works", key: "howItWorks" },
  { href: "/projects", key: "projects" },
] as const;

// Base da Sidebar: institucional e a ação de orçamento (fluxo de proposta).
export const ABOUT_NAV = { href: "/about", key: "about" } as const;
export const QUOTE_NAV = { href: "/build", key: "build" } as const;

// Rodapé ("Mais"): demais páginas reais, fora do menu lateral.
export const SECONDARY_NAV = [ABOUT_NAV, { href: "/contact", key: "contact" }] as const;

// Breadcrumb: toda página com rótulo próprio.
export const ALL_NAV = [...MAIN_NAV, ...SECONDARY_NAV, QUOTE_NAV] as const;

export type NavItem = (typeof ALL_NAV)[number];

export function isNavItemActive(href: string, pathname: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
