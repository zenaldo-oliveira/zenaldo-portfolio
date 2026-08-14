import type { WhatsAppService, WhatsAppSendResult } from "./types";

// Integração real com a Z-API — intencionalmente NÃO implementada nesta fase.
// Quando as credenciais da sua conta Z-API forem fornecidas e a integração
// real for autorizada, implementar aqui a chamada HTTP para a Z-API usando
// variáveis de ambiente do servidor (nunca NEXT_PUBLIC_*), por exemplo:
// ZAPI_INSTANCE_ID, ZAPI_TOKEN, ZAPI_CLIENT_TOKEN.
export class ZApiWhatsAppService implements WhatsAppService {
  async sendMessage(): Promise<WhatsAppSendResult> {
    throw new Error(
      "ZApiWhatsAppService ainda não foi implementado — nenhuma integração real de WhatsApp está configurada.",
    );
  }
}
