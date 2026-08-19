import { ProjectsContent } from "@/components/projects/ProjectsContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cases e Projetos | ZTech Solutions",
  description:
    "Cases e projetos desenvolvidos pela ZTech Solutions: sistemas, plataformas e aplicações reais, com o problema resolvido e a solução entregue em cada um.",
  keywords: [
    "cases de desenvolvimento de software",
    "projetos full stack",
    "sistema de gestão",
    "React Native",
    "Next.js",
    "inteligência artificial",
  ],
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsPage() {
  return <ProjectsContent />;
}
