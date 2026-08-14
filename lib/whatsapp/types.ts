export type WhatsAppSendResult = {
  success: boolean;
  provider: "mock" | "zapi";
  skipped?: boolean;
  error?: string;
};

export interface WhatsAppService {
  sendMessage(to: string, message: string): Promise<WhatsAppSendResult>;
}
