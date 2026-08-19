// Normaliza um número de WhatsApp para dígitos com DDI (55 assumido para
// números sem DDI, já que o público do portfólio é brasileiro). Retorna null
// quando o valor claramente não parece um telefone válido — funciona tanto
// como normalização quanto como uma validação leve de formato.
export function normalizeWhatsapp(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");

  if (digits.length < 10 || digits.length > 13) {
    return null;
  }

  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  return digits;
}
