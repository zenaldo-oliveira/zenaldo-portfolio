import { CertificatesContent } from "@/components/certificates/CertificatesContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certificados | Zenaldo Oliveira — Desenvolvedor Full Stack",
  description:
    "Formação em Análise e Desenvolvimento de Sistemas, especializações e certificações em React, Next.js, TypeScript e IA & Automação.",
  keywords: [
    "certificados desenvolvedor",
    "formação Análise e Desenvolvimento de Sistemas",
    "certificação React",
    "certificação Next.js",
  ],
  alternates: {
    canonical: "/certificates",
  },
};

export default function CertificatesPage() {
  return <CertificatesContent />;
}
