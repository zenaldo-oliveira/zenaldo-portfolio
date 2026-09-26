import { getRecentMockNotifications } from "@/lib/whatsapp/mockWhatsAppService";
import { isWhatsAppMockMode } from "@/lib/whatsapp/getWhatsAppService";

// Endpoint só para visualizar notificações simuladas durante o desenvolvimento
// local. As notificações contêm nome e WhatsApp de leads (dados pessoais), então
// nunca responde em produção — independente do provedor configurado.
export async function GET() {
  if (process.env.NODE_ENV === "production" || !isWhatsAppMockMode()) {
    return new Response("Not found", { status: 404 });
  }

  return Response.json({
    mode: "mock",
    notifications: getRecentMockNotifications(),
  });
}
