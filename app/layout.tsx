import { FloatingWhatsapp } from "@/components/floating-whatsapp";
import { AppShell } from "@/components/layout/AppShell";
import { PageBackground } from "@/components/layout/PageBackground";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// O Chat ZTech AI (components/AIAssistant.tsx, app/api/chat/route.ts) foi
// removido da interface pública nesta etapa, mas mantido como código legado
// — nenhuma página depende dele (confirmado via auditoria) e /api/leads,
// ContactForm e a notificação continuam funcionando normalmente sem ele.
// Reative importando e renderizando <AIAssistant /> novamente se necessário.

// Executa antes do primeiro paint para evitar flash: aplica no <html> o tema
// salvo (data-theme) e o estado recolhido da Sidebar (data-sidebar). Sem
// isto, ambos só seriam aplicados depois da hidratação, causando flash do
// tema padrão e deslocamento do layout. Chaves e atributos compartilhados com
// lib/preferences; "true" é o valor legado da Sidebar antiga. Script
// estático, sem dado do usuário.
const PREFERENCES_INIT_SCRIPT = `(function(){try{var d=document.documentElement;var t=localStorage.getItem("theme");d.setAttribute("data-theme",t==="light"?"light":"dark");var s=localStorage.getItem("sidebar-collapsed");if(s==="collapsed"||s==="true")d.setAttribute("data-sidebar","collapsed");}catch(e){}})();`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ZTech Solutions | Desenvolvimento de Software para Empresas",
    template: "%s",
  },
  description:
    "A ZTech Solutions desenvolve sistemas web, SaaS, automações e soluções com inteligência artificial para empresas que querem ganhar produtividade, controle e escala.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "ZTech Solutions",
    title: "ZTech Solutions | Desenvolvimento de Software para Empresas",
    description:
      "Sistemas web, SaaS, automações e soluções com inteligência artificial para empresas que querem ganhar produtividade, controle e escala.",
    // TODO: adicionar `images` com um asset OG de 1200x630 assim que ele existir
    // (nenhuma imagem adequada foi encontrada em /public no momento desta implementação).
  },
  twitter: {
    card: "summary",
    title: "ZTech Solutions | Desenvolvimento de Software para Empresas",
    description:
      "Sistemas web, SaaS, automações e soluções com inteligência artificial para empresas que querem ganhar produtividade, controle e escala.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: o script abaixo altera atributos do <html>
    // (data-theme, data-sidebar) antes da hidratação, de propósito. Vale só
    // para os atributos deste elemento, não para os filhos.
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREFERENCES_INIT_SCRIPT }} />
      </head>
      <body className="bg-background text-foreground">
        <PageBackground />

        <LanguageProvider>
          <AppShell>{children}</AppShell>

          <FloatingWhatsapp />
        </LanguageProvider>
      </body>
    </html>
  );
}
