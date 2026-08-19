import { ServicesContent } from "@/components/services/ServicesContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Serviços | ZTech Solutions — Desenvolvimento de Software",
  description:
    "Sistemas empresariais, SaaS, inteligência artificial, automação, sistemas web e integrações — desenvolvidos com React, Next.js, TypeScript, Prisma e PostgreSQL.",
  keywords: [
    "sistemas empresariais",
    "desenvolvimento de SaaS",
    "inteligência artificial para empresas",
    "automação de processos",
    "integração de sistemas",
    "desenvolvimento de software",
  ],
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesPage() {
  return <ServicesContent />;
}
