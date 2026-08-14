const DEFAULT_WINDOW_MS = 5 * 60_000;

// Best-effort, em memória (mesmo padrão do rate limit do /api/chat): evita
// notificar duas vezes o mesmo lead dentro da janela de proteção. Por
// instância do servidor, não é um lock distribuído.
const recentNotifications = new Map<string, number>();

export function shouldSkipDuplicateNotification(
  key: string,
  windowMs: number = DEFAULT_WINDOW_MS,
): boolean {
  const now = Date.now();
  const last = recentNotifications.get(key);

  if (last !== undefined && now - last < windowMs) {
    return true;
  }

  recentNotifications.set(key, now);
  return false;
}
