import { AboutContent } from "@/components/about/AboutContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre a ZTech Solutions",
  description:
    "A ZTech Solutions desenvolve soluções digitais personalizadas — sistemas web, SaaS, automações e agentes de inteligência artificial — para empresas que querem digitalizar processos e ganhar eficiência.",
  keywords: [
    "ZTech Solutions",
    "empresa de desenvolvimento de software",
    "sistemas empresariais",
    "SaaS",
    "React",
    "Next.js",
    "TypeScript",
  ],
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
