import { HomeContent } from "@/components/home/HomeContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ZTech Solutions | Desenvolvimento de Software para Empresas",
  description:
    "A ZTech Solutions desenvolve sistemas web, SaaS, automações e soluções com inteligência artificial para empresas que querem ganhar produtividade, controle e escala.",
  keywords: [
    "desenvolvimento de software",
    "sistemas empresariais",
    "SaaS",
    "automação de processos",
    "inteligência artificial para empresas",
    "Next.js",
    "React",
  ],
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <HomeContent />;
}
