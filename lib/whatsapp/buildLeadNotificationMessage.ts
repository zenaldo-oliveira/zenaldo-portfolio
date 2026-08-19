import type { QualificationStatus } from "@/lib/leads/scoring";

export type LeadNotificationData = {
  nome: string;
  whatsapp: string;
  empresa?: string;
  segmento?: string;
  interesse?: string;
  necessidade?: string;
  projectType?: string;
  urgency?: string;
  budget?: string;
  score?: number;
  status?: QualificationStatus;
  origin: string;
  leadId?: string | number;
};

const FALLBACK = "Não informado";

const STATUS_META: Record<QualificationStatus, { emoji: string; label: string }> = {
  hot: { emoji: "🔥", label: "QUENTE" },
  warm: { emoji: "🟡", label: "MORNO" },
  cold: { emoji: "🔵", label: "FRIO" },
};

// Compatível com o formato legado (formulário de contato: nome/whatsapp/
// interesse/necessidade/empresa/segmento, sem score/status) e com o novo
// lead qualificado pelo ZTech AI (inclui projectType/urgency/budget/score/
// status) — as seções extras só aparecem quando os campos correspondentes
// estão presentes, então o formato legado continua idêntico ao de antes.
export function buildLeadNotificationMessage(lead: LeadNotificationData): string {
  const dataHora = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Cuiaba",
  });

  const statusMeta = lead.status ? STATUS_META[lead.status] : null;

  const lines = [
    statusMeta
      ? `${statusMeta.emoji} NOVO LEAD QUALIFICADO`
      : "🚨 NOVO LEAD — PORTFÓLIO ZTECH",
    "",
    `👤 Nome: ${lead.nome}`,
  ];

  if (lead.empresa) {
    lines.push(`🏢 Empresa: ${lead.empresa}`);
  }

  if (lead.segmento) {
    lines.push(`🏷️ Segmento: ${lead.segmento}`);
  }

  lines.push(
    `📱 WhatsApp: ${lead.whatsapp}`,
    "",
    "🎯 Interesse:",
    lead.interesse || FALLBACK,
  );

  if (lead.projectType) {
    lines.push("", "💼 Projeto:", lead.projectType);
  }

  lines.push("", "📝 Necessidade:", lead.necessidade || lead.interesse || FALLBACK);

  if (lead.urgency) {
    lines.push("", "⏰ Urgência:", lead.urgency);
  }

  if (lead.budget) {
    lines.push("", "💰 Orçamento:", lead.budget);
  }

  if (statusMeta && typeof lead.score === "number") {
    lines.push(
      "",
      "📊 Score:",
      `${lead.score}/100`,
      "",
      `${statusMeta.emoji} Status:`,
      statusMeta.label,
    );
  }

  lines.push("", "🌐 Origem:", lead.origin, "", "⏰ Data:", dataHora);

  if (lead.leadId !== undefined) {
    lines.push("", "🆔 Lead ID:", String(lead.leadId));
  }

  return lines.join("\n");
}
