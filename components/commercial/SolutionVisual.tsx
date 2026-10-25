"use client";

import {
  AppPreview,
  FlowPreview,
  IntegrationsPreview,
  SaasPreview,
  SystemPreview,
  WebPreview,
} from "@/components/services/SolutionVisuals";
import type { SolutionVisual as SolutionVisualId } from "@/lib/catalog/data";

// Ilustrações conceituais já usadas na Home, escolhidas por solução em
// lib/catalog/data.ts (sem telas inventadas apresentadas como reais).
export function SolutionVisual({ visual }: { visual: SolutionVisualId }) {
  switch (visual) {
    case "web":
      return <WebPreview />;
    case "app":
      return <AppPreview />;
    case "system":
      return <SystemPreview />;
    case "integrations":
      return <IntegrationsPreview />;
    case "saas":
      return <SaasPreview />;
    case "flow":
      return <FlowPreview highlight={1} />;
  }
}
