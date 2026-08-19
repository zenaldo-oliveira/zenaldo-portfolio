import { getWhatsAppService } from "@/lib/whatsapp/getWhatsAppService";
import type { NotificationResult, NotificationService } from "./types";

// Hoje só existe um canal implementado de verdade — WhatsApp, via
// getWhatsAppService() (que já resolve mock vs. Z-API pela env
// WHATSAPP_PROVIDER, nunca no frontend). Esta camada existe para que o funil
// de leads (app/api/leads/route.ts) dependa de um conceito genérico de
// "notificação", não de WhatsApp especificamente — adicionar Telegram ou
// e-mail no futuro significa estender resolveService() aqui, sem reescrever
// o funil nem tocar em app/api/leads/route.ts.
class WhatsAppNotificationService implements NotificationService {
  async send(recipient: string, message: string): Promise<NotificationResult> {
    const result = await getWhatsAppService().sendMessage(recipient, message);

    return {
      success: result.success,
      channel: "whatsapp",
      skipped: result.skipped,
      error: result.error,
    };
  }
}

let service: NotificationService | null = null;

export function getNotificationService(): NotificationService {
  if (!service) {
    service = new WhatsAppNotificationService();
  }

  return service;
}
