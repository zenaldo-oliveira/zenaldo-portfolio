import type { WhatsAppService } from "./types";
import { MockWhatsAppService } from "./mockWhatsAppService";
import { ZApiWhatsAppService } from "./zApiWhatsAppService";

// A decisão de provedor é lida inteiramente no servidor, a partir de uma
// variável de ambiente SEM prefixo NEXT_PUBLIC_ — nunca é enviada ao client
// nem decidida a partir de algo que o frontend controla. Qualquer valor
// diferente de "zapi" (incluindo ausente) cai no Mock, que é o padrão seguro.
function resolveProvider(): "mock" | "zapi" {
  return process.env.WHATSAPP_PROVIDER?.toLowerCase() === "zapi" ? "zapi" : "mock";
}

let service: WhatsAppService | null = null;

export function getWhatsAppService(): WhatsAppService {
  if (!service) {
    service = resolveProvider() === "zapi" ? new ZApiWhatsAppService() : new MockWhatsAppService();
  }

  return service;
}

export function isWhatsAppMockMode(): boolean {
  return resolveProvider() !== "zapi";
}
