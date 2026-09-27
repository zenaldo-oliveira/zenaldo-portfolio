
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
export const MAIN_NAV = [
  { href: "/", key: "home" },
  { href: "/services", key: "services" },
  { href: "/projects", key: "projects" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export const SECONDARY_NAV = [
  { href: "/skills", key: "skills" },
  { href: "/certificates", key: "certificates" },
] as const;

export type NavItem = (typeof MAIN_NAV)[number] | (typeof SECONDARY_NAV)[number];

export function isNavItemActive(href: string, pathname: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
