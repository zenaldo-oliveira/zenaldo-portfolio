import { ServicesContent } from "@/components/services/ServicesContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Soluções | ZTech Solutions — Sites, sistemas e automações",
  description:
    "Landing pages, catálogos digitais, CRM, automações, assistentes com IA, sistemas sob medida e ERP/SaaS: para quem serve, o que inclui e como contratar.",
  keywords: [
    "criação de sites para empresas",
    "catálogo digital",
    "CRM para pequenas empresas",
    "automação de processos",
    "assistente com inteligência artificial",
    "sistema sob medida",
    "ERP e SaaS",
  ],
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesPage() {
  return <ServicesContent />;
}
