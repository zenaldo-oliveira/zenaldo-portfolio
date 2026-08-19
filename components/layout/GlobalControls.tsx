"use client";

import { LanguageSelector } from "@/components/layout/LanguageSelector";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function GlobalControls() {
  return (
    <div className="fixed right-3 top-3 z-40 flex items-center gap-2 md:right-6 md:top-6">
      <LanguageSelector />
      <ThemeToggle />
    </div>
  );
}
