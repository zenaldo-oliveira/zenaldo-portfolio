import { PlansContent } from "@/components/plans/PlansContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Planos | ZTech Solutions — Implantação e mensalidade",
  description:
    "Planos para sites, catálogos digitais, CRM e automações com implantação e mensalidade separadas, adicionais e custos externos explicados. Valores sob consulta.",
  alternates: {
    canonical: "/plans",
  },
};

export default function PlansPage() {
  return <PlansContent />;
}
