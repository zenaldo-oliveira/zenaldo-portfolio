"use client";

import { Brain, Globe, Layers, Plug, Smartphone, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useTranslations } from "@/lib/i18n/LanguageContext";

// Mesma ordem de t.home.capabilities.items: Sistemas Web, SaaS, Aplicativos,
// IA, Automação, Integrações.
const ICONS: LucideIcon[] = [Globe, Layers, Smartphone, Brain, Workflow, Plug];

// Faixa logo abaixo do Hero: a "assinatura" do que a ZTech constrói.
export function CapabilitiesStrip() {
  const t = useTranslations();
  const { label, items } = t.home.capabilities;

  return (
    <section
      id="capacidades"
      aria-label={label}
      className="mt-(--space-section-default) border-y border-border bg-(--sidebar-bg) px-4 py-6 sm:px-6"
    >
      <Container className="flex flex-col gap-5 xl:flex-row xl:items-center xl:gap-10">
        <p className="shrink-0 font-mono text-xs uppercase tracking-[0.14em] text-text-muted">
          {label}
        </p>

        <ul className="grid flex-1 grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 xl:flex xl:justify-between">
          {items.map((item, index) => {
            const Icon = ICONS[index];

            return (
              <li key={item} className="flex items-center gap-2.5 text-sm font-medium text-text-primary">
                <Icon size={16} strokeWidth={1.75} aria-hidden="true" className="shrink-0 text-accent" />
                {item}
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
