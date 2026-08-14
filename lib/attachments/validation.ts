export const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024; // 10MB

export const ALLOWED_ATTACHMENT_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
  "text/plain",
] as const;

export type AllowedAttachmentType = (typeof ALLOWED_ATTACHMENT_TYPES)[number];

export function isAllowedAttachmentType(
  type: string,
): type is AllowedAttachmentType {
  return (ALLOWED_ATTACHMENT_TYPES as readonly string[]).includes(type);
}

/**
 * Confere a assinatura real dos primeiros bytes do arquivo — nunca confia
 * somente no MIME type informado pelo navegador/cliente.
 */
export function matchesFileSignature(
  type: AllowedAttachmentType,
  bytes: Uint8Array,
): boolean {
  switch (type) {
    case "image/png":
      return (
        bytes[0] === 0x89 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x4e &&
        bytes[3] === 0x47
      );
    case "image/jpeg":
      return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    case "image/webp":
      return (
        bytes[0] === 0x52 &&
        bytes[1] === 0x49 &&
        bytes[2] === 0x46 &&
        bytes[3] === 0x46 &&
        bytes[8] === 0x57 &&
        bytes[9] === 0x45 &&
        bytes[10] === 0x42 &&
        bytes[11] === 0x50
      );
    case "application/pdf":
      return (
        bytes[0] === 0x25 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x44 &&
        bytes[3] === 0x46
      ); // %PDF
    case "text/plain": {
      // TXT não tem assinatura binária — valida heuristicamente que o
      // conteúdo parece texto (sem bytes nulos nos primeiros KB, típico
      // de arquivos binários renomeados para .txt).
      const sample = bytes.subarray(0, Math.min(bytes.length, 2048));
      for (const byte of sample) {
        if (byte === 0) return false;
      }
      return true;
    }
    default:
      return false;
  }
}
