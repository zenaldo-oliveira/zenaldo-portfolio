import { CertificatesContent } from "@/components/certificates/CertificatesContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formação e certificações | ZTech Solutions",
  description:
    "Formação acadêmica, especialização e estudos em andamento de quem está por trás da ZTech Solutions.",
  keywords: [
    "formação Análise e Desenvolvimento de Sistemas",
    "ZTech Solutions",
  ],
  alternates: {
    canonical: "/certificates",
  },
};

export default function CertificatesPage() {
  return <CertificatesContent />;
}
