export type LeadNotificationData = {
  nome: string;
  whatsapp: string;
  empresa?: string;
  segmento?: string;
  interesse?: string;
  necessidade?: string;
  leadId?: string | number;
};

const FALLBACK = "Não informado";

export function buildLeadNotificationMessage(lead: LeadNotificationData): string {
  const dataHora = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Cuiaba",
  });

  const lines = [
    "🚨 NOVO LEAD — PORTFÓLIO ZTECH",
    "",
    `👤 Nome: ${lead.nome}`,
    `🏢 Empresa: ${lead.empresa || FALLBACK}`,
  ];

  if (lead.segmento) {
    lines.push(`🏷️ Segmento: ${lead.segmento}`);
  }

  lines.push(
    `📱 WhatsApp: ${lead.whatsapp}`,
    "",
    "🎯 Interesse:",
    lead.interesse || FALLBACK,
    "",
    "💬 Necessidade:",
    lead.necessidade || lead.interesse || FALLBACK,
    "",
    "🤖 Origem:",
    "portfolio-ai",
    "",
    "⏰ Data:",
    dataHora,
  );

  if (lead.leadId !== undefined) {
    lines.push("", "🆔 Lead ID:", String(lead.leadId));
  }

  return lines.join("\n");
}
