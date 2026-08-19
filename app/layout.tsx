import { FloatingWhatsapp } from "@/components/floating-whatsapp";
import { GlobalControls } from "@/components/layout/GlobalControls";
import { Sidebar } from "@/components/layout/Sidebar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import "./globals.css";

// O Chat ZTech AI (components/AIAssistant.tsx, app/api/chat/route.ts) foi
// removido da interface pública nesta etapa, mas mantido como código legado
// — nenhuma página depende dele (confirmado via auditoria) e /api/leads,
// ContactForm e a notificação continuam funcionando normalmente sem ele.
// Reative importando e renderizando <AIAssistant /> novamente se necessário.

// Executa antes do primeiro paint para evitar flash: aplica o data-theme
// salvo no <html> assim que possível. Sem isto, o tema só seria aplicado
// depois da hidratação do ThemeToggle, causando um flash visual do estado
// padrão. Sem dependências novas — script estático, sem dado do usuário.
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");document.documentElement.setAttribute("data-theme",t==="light"?"light":"dark");}catch(e){}})();`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zenaldodev.com.br"),
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
    url: "https://zenaldodev.com.br",
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
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="bg-background text-foreground">
        <LanguageProvider>
          <Sidebar />

          <GlobalControls />

          <main className="min-h-screen md:ml-[280px]">{children}</main>

          <FloatingWhatsapp />
        </LanguageProvider>
      </body>
    </html>
  );
}
