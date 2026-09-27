import { ContactContent } from "@/components/contact/ContactContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato | ZTech Solutions",
  description:
    "Fale com a ZTech Solutions pelo WhatsApp ou envie uma mensagem: sistemas web, SaaS, aplicativos, automações e soluções com inteligência artificial para a sua empresa.",
  keywords: [
    "contato ZTech Solutions",
    "orçamento de software",
    "desenvolvimento de sistemas para empresas",
  ],
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
