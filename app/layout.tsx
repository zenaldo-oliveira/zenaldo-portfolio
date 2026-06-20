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
  title: "Portfólio Zenaldo",
  description: "Desenvolvedor Full Stack",
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
      <body className="bg-black text-white">
        <Sidebar />

        <main className="min-h-screen md:ml-[280px]">{children}</main>

        <FloatingWhatsapp />

        <AIAssistant />
      </body>
    </html>
  );
}
