import type { WhatsAppService, WhatsAppSendResult } from "./types";

export type MockWhatsAppRecord = {
  to: string;
  message: string;
  sentAt: string;
};

const MAX_RECORDS = 20;
const records: MockWhatsAppRecord[] = [];

// Nunca faz nenhuma chamada de rede. Apenas registra, no log do servidor e
// em memória, a mensagem que seria enviada — usado enquanto WHATSAPP_PROVIDER
// não estiver configurado como "zapi".
export class MockWhatsAppService implements WhatsAppService {
  async sendMessage(to: string, message: string): Promise<WhatsAppSendResult> {
    const record: MockWhatsAppRecord = {
      to,
      message,
      sentAt: new Date().toISOString(),
    };

    records.unshift(record);
    records.length = Math.min(records.length, MAX_RECORDS);

    console.log(`[MOCK WHATSAPP]\n\nDestino:\n${to}\n\nMensagem:\n\n${message}\n`);

    return { success: true, provider: "mock" };
  }
}

export function getRecentMockNotifications(): MockWhatsAppRecord[] {
  return records;
}
