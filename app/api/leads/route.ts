import { supabase } from "@/components/lib/supabase";
import { getNotificationService } from "@/lib/notifications/getNotificationService";
import {
  buildLeadNotificationMessage,
  type LeadNotificationData,
} from "@/lib/whatsapp/buildLeadNotificationMessage";
import { shouldSkipDuplicateNotification } from "@/lib/whatsapp/notificationDedupe";
import {
  computeQualificationScore,
  classifyQualification,
  isValidQualificationStatus,
  isValidQualificationScore,
} from "@/lib/leads/scoring";
import { normalizeWhatsapp } from "@/lib/leads/normalizeWhatsapp";

const MAX_FIELD_LENGTH = 200;

// Destinatário da notificação de novo lead. Lido só no servidor — nunca
// prefixado com NEXT_PUBLIC_, nunca enviado ao client.
const NOTIFICATION_RECIPIENT = process.env.LEAD_NOTIFICATION_WHATSAPP ?? "";

// Rate limit próprio desta rota (mesmo padrão em memória do /api/chat, mas
// separado — /api/leads é pública e é chamada bem menos vezes por sessão que
// o chat, então o limite é mais apertado).
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestTimestamps = new Map<string, number[]>();

function getClientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const recent = (requestTimestamps.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestTimestamps.set(ip, recent);
    return true;
  }

  recent.push(now);
  requestTimestamps.set(ip, recent);
  return false;
}

function isNonEmptyString(
  value: unknown,
  maxLength = MAX_FIELD_LENGTH,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= maxLength
  );
}

function optionalString(value: unknown, maxLength = MAX_FIELD_LENGTH) {
  return isNonEmptyString(value, maxLength) ? value.trim() : undefined;
}

async function notifyLead(message: string, dedupeKey: string) {
  if (!NOTIFICATION_RECIPIENT) {
    console.error(
      "Notificação de lead não enviada: variável LEAD_NOTIFICATION_WHATSAPP não configurada.",
    );
    return;
  }

  if (shouldSkipDuplicateNotification(dedupeKey)) {
    console.log(
      `[WHATSAPP] Notificação ignorada — já enviada recentemente para "${dedupeKey}".`,
    );
    return;
  }

  try {
    const result = await getNotificationService().send(
      NOTIFICATION_RECIPIENT,
      message,
    );

    if (!result.success) {
      console.error("Falha ao enviar notificação de lead:", result.error);
    }
  } catch (notificationError) {
    // Uma falha aqui nunca deve derrubar a resposta — o lead já foi salvo.
    console.error("Erro inesperado ao notificar lead:", notificationError);
  }
}

// Verifica se já existe um lead salvo para este WhatsApp normalizado — evita
// linhas duplicadas no Supabase quando o mesmo visitante volta à conversa.
async function findExistingLeadByWhatsapp(whatsapp: string) {
  const { data, error } = await supabase
    .from("leads")
    .select("id")
    .eq("whatsapp", whatsapp)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Erro ao verificar lead existente:", error);
    return null;
  }

  return data as { id: string | number } | null;
}

// ===== Caminho legado: formulário de contato (app/contact) =====
// Formato e comportamento inalterados — sempre insere, sempre tenta
// notificar, sem score/qualificação (é um contato deliberado, não um sinal
// inferido pela IA).
async function handleLegacyContactLead(body: Record<string, unknown>) {
  if (!isNonEmptyString(body.nome) || !isNonEmptyString(body.whatsapp)) {
    return Response.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const nome = body.nome.trim();
  const whatsapp = body.whatsapp.trim();
  const interesse = isNonEmptyString(body.interesse)
    ? body.interesse.trim()
    : "";
  const empresa = optionalString(body.empresa);
  const segmento = optionalString(body.segmento);
  const necessidade = optionalString(body.necessidade);

  const { error } = await supabase.from("leads").insert([
    { nome, whatsapp, interesse },
  ]);

  if (error) {
    console.error("Erro ao salvar lead no Supabase:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }

  const message = buildLeadNotificationMessage({
    nome,
    whatsapp,
    empresa,
    segmento,
    interesse,
    necessidade,
    origin: "Portfólio — Formulário de Contato",
  });

  await notifyLead(message, `${nome.toLowerCase()}|${whatsapp}`);

  return Response.json({ success: true });
}

// ===== Caminho novo: lead qualificado pelo ZTech AI =====
async function handleAiQualifiedLead(body: Record<string, unknown>) {
  if (!isNonEmptyString(body.name) || !isNonEmptyString(body.whatsapp)) {
    return Response.json({ error: "Dados inválidos" }, { status: 400 });
  }

  // Validação defensiva de score/status, se enviados pelo client — mas a
  // decisão de notificar SEMPRE usa o score recalculado abaixo a partir dos
  // sinais brutos, nunca o que o client afirma. Nunca confiar em dados
  // enviados diretamente pelo browser.
  if (body.score !== undefined && !isValidQualificationScore(body.score)) {
    return Response.json({ error: "Score inválido" }, { status: 400 });
  }

  if (body.status !== undefined && !isValidQualificationStatus(body.status)) {
    return Response.json({ error: "Status inválido" }, { status: 400 });
  }

  const whatsapp = normalizeWhatsapp(body.whatsapp.trim());

  if (!whatsapp) {
    return Response.json({ error: "WhatsApp inválido" }, { status: 400 });
  }

  const name = body.name.trim().slice(0, MAX_FIELD_LENGTH);
  const interest = optionalString(body.interest);
  const projectType = optionalString(body.projectType);
  const need = optionalString(body.need);
  const urgency = optionalString(body.urgency);
  const budget = optionalString(body.budget);
  const intent = optionalString(body.intent);

  const score = computeQualificationScore({
    name,
    whatsapp,
    interest,
    projectType,
    need,
    urgency,
    budget,
    intent,
  });
  const status = classifyQualification(score);

  const existing = await findExistingLeadByWhatsapp(whatsapp);

  if (!existing) {
    const { error } = await supabase.from("leads").insert([
      { nome: name, whatsapp, interesse: interest ?? "" },
    ]);

    if (error) {
      console.error("Erro ao salvar lead qualificado no Supabase:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  // Nunca notificar leads frios — só warm/hot.
  if (status === "cold") {
    return Response.json({ success: true, saved: !existing, notified: false, status });
  }

  const notificationData: LeadNotificationData = {
    nome: name,
    whatsapp,
    interesse: interest,
    necessidade: need,
    projectType,
    urgency,
    budget,
    score,
    status,
    origin: "Portfólio — ZTech AI",
    leadId: existing?.id,
  };

  await notifyLead(
    buildLeadNotificationMessage(notificationData),
    `${name.toLowerCase()}|${whatsapp}`,
  );

  return Response.json({ success: true, saved: !existing, notified: true, status, score });
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);

    if (isRateLimited(ip)) {
      return Response.json(
        { error: "Muitas solicitações. Tente novamente em instantes." },
        { status: 429 },
      );
    }

    const body = await req.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return Response.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const record = body as Record<string, unknown>;

    if (isNonEmptyString(record.nome)) {
      return await handleLegacyContactLead(record);
    }

    return await handleAiQualifiedLead(record);
  } catch (error) {
    console.error("Erro ao processar lead:", error);

    return Response.json({ error: "Erro ao salvar lead" }, { status: 500 });
  }
}
