import type { Metadata } from "next";
import { HomeContent } from "@/components/home/HomeContent";

export const metadata: Metadata = {
  title: "ZTech Solutions | Software, SaaS e Automação",
  description:
    "Desenvolvemos sistemas empresariais, plataformas SaaS, automações e soluções com inteligência artificial para transformar processos e impulsionar negócios.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <HomeContent />;
}
