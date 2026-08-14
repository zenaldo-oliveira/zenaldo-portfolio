import { getRecentMockNotifications } from "@/lib/whatsapp/mockWhatsAppService";
import { isWhatsAppMockMode } from "@/lib/whatsapp/getWhatsAppService";

// Endpoint só para visualizar notificações simuladas durante o desenvolvimento.
// Nunca expõe credenciais nem dados fora do que já foi "enviado" pelo Mock.
// Deixa de responder automaticamente assim que WHATSAPP_PROVIDER sair de "mock".
export async function GET() {
  if (!isWhatsAppMockMode()) {
    return new Response("Not found", { status: 404 });
  }

  return Response.json({
    mode: "mock",
    notifications: getRecentMockNotifications(),
  });
}
