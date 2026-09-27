import { SkillsContent } from "@/components/skills/SkillsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Capacidades técnicas | ZTech Solutions",
  description:
    "Capacidades técnicas da ZTech Solutions em web, mobile, backend, dados, inteligência artificial e automação — com os projetos em que cada tecnologia foi aplicada.",
  keywords: [
    "capacidades técnicas",
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
