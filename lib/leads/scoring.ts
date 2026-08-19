export type QualificationStatus = "cold" | "warm" | "hot";

export type LeadSignals = {
  name?: string | null;
  whatsapp?: string | null;
  interest?: string | null;
  projectType?: string | null;
  need?: string | null;
  urgency?: string | null;
  budget?: string | null;
  intent?: string | null;
};

// Pontuação simples, determinística e auditável — cada sinal identificado na
// conversa soma pontos fixos. Nunca calculada pela IA: sempre a partir de
// campos já validados/normalizados no backend (ver sanitizeExtractedField em
// app/api/chat/route.ts e os validadores em app/api/leads/route.ts).
const SIGNAL_POINTS: Record<keyof LeadSignals, number> = {
  name: 10,
  whatsapp: 20,
  interest: 15,
  projectType: 15,
  need: 15,
  urgency: 10,
  budget: 5,
  intent: 10,
};

function isFilled(value?: string | null): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function computeQualificationScore(signals: LeadSignals): number {
  const score = (Object.keys(SIGNAL_POINTS) as (keyof LeadSignals)[]).reduce(
    (total, key) => total + (isFilled(signals[key]) ? SIGNAL_POINTS[key] : 0),
    0,
  );

  return Math.min(score, 100);
}

export function classifyQualification(score: number): QualificationStatus {
  if (score >= 70) return "hot";
  if (score >= 40) return "warm";
  return "cold";
}

export function isValidQualificationStatus(
  value: unknown,
): value is QualificationStatus {
  return value === "cold" || value === "warm" || value === "hot";
}

export function isValidQualificationScore(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 100
  );
}
