import { SkillsContent } from "@/components/skills/SkillsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Habilidades | Zenaldo Oliveira — Desenvolvedor Full Stack",
  description:
    "Desenvolvimento Full Stack, Inteligência Artificial e automações para criar soluções modernas, escaláveis e focadas em resultados.",
  keywords: [
    "habilidades desenvolvedor full stack",
    "React",
    "Next.js",
    "Node.js",
    "PostgreSQL",
    "OpenAI",
    "automação WhatsApp",
  ],
  alternates: {
    canonical: "/skills",
  },
};

export default function SkillsPage() {
  return <SkillsContent />;
}
