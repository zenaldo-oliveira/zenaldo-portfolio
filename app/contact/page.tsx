import { ContactContent } from "@/components/contact/ContactContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato | Zenaldo Oliveira — Desenvolvedor Full Stack",
  description:
    "Estou disponível para freelas, desenvolvimento de sistemas, landing pages, dashboards, integrações com APIs e projetos Full Stack. Entre em contato pelo WhatsApp, e-mail, GitHub ou LinkedIn.",
  keywords: [
    "contato desenvolvedor full stack",
    "orçamento site profissional",
    "contratar desenvolvedor React Next.js",
  ],
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
