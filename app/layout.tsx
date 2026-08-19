import { FloatingWhatsapp } from "@/components/floating-whatsapp";
import { Sidebar } from "@/components/layout/Sidebar";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import AIAssistant from "@/components/AIAssistant";
import "./globals.css";

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
      <body className="bg-[#020617] text-white">
        <Sidebar />

        <main className="min-h-screen md:ml-[280px]">{children}</main>

        <FloatingWhatsapp />

        <AIAssistant />
      </body>
    </html>
  );
}
