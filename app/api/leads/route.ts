import { supabase } from "@/components/lib/supabase";
import { getWhatsAppService } from "@/lib/whatsapp/getWhatsAppService";
import { buildLeadNotificationMessage } from "@/lib/whatsapp/buildLeadNotificationMessage";
import { shouldSkipDuplicateNotification } from "@/lib/whatsapp/notificationDedupe";

const MAX_FIELD_LENGTH = 200;

// Destinatário da notificação de novo lead. Lido só no servidor — nunca
// prefixado com NEXT_PUBLIC_, nunca enviado ao client.
const NOTIFICATION_RECIPIENT = process.env.LEAD_NOTIFICATION_WHATSAPP ?? "";

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

async function notifyNewLead(lead: {
  nome: string;
  whatsapp: string;
  interesse: string;
  empresa?: string;
  segmento?: string;
  necessidade?: string;
}) {
  if (!NOTIFICATION_RECIPIENT) {
    console.error(
      "Notificação de lead não enviada: variável LEAD_NOTIFICATION_WHATSAPP não configurada.",
    );
    return;
  }

  const dedupeKey = `${lead.nome.toLowerCase()}|${lead.whatsapp}`;

  if (shouldSkipDuplicateNotification(dedupeKey)) {
    console.log(
      `[WHATSAPP] Notificação ignorada — já enviada recentemente para "${dedupeKey}".`,
    );
    return;
  }

  try {
    const message = buildLeadNotificationMessage(lead);
    const result = await getWhatsAppService().sendMessage(
      NOTIFICATION_RECIPIENT,
      message,
    );

    if (!result.success) {
      console.error("Falha ao enviar notificação de novo lead:", result.error);
    }
  } catch (notificationError) {
    // Uma falha aqui nunca deve derrubar a resposta — o lead já foi salvo.
    console.error(
      "Erro inesperado ao notificar novo lead:",
      notificationError,
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (
      !body ||
      !isNonEmptyString(body.nome) ||
      !isNonEmptyString(body.whatsapp)
    ) {
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
      {
        nome,
        whatsapp,
        interesse,
      },
    ]);

    if (error) {
      console.error("Erro ao salvar lead no Supabase:", error);

      return Response.json({ error: error.message }, { status: 500 });
    }

    // Só a partir daqui o INSERT está confirmado — a notificação nunca
    // acontece antes disso, e uma falha nela não desfaz o lead já salvo.
    await notifyNewLead({ nome, whatsapp, interesse, empresa, segmento, necessidade });

    return Response.json({
      success: true,
    });
  } catch (error) {
    console.error("Erro ao processar lead:", error);

    return Response.json({ error: "Erro ao salvar lead" }, { status: 500 });
  }
}
