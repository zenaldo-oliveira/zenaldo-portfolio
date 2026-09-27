// Fonte única do contato por WhatsApp no frontend. Nenhum componente deve
// montar links wa.me ou repetir o número/mensagem diretamente — sempre usar
// buildWhatsAppUrl(). CTAs contextuais (ex.: cases) passam a própria mensagem.
export const WHATSAPP_NUMBER = "5565992832422";

export const WHATSAPP_DEFAULT_MESSAGE =
  "Olá! Conheci a ZTech pelo site e gostaria de conversar sobre um projeto para minha empresa.";

export function buildWhatsAppUrl(
  message: string = WHATSAPP_DEFAULT_MESSAGE,
): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
