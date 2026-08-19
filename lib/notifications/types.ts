export type NotificationResult = {
  success: boolean;
  channel: string;
  skipped?: boolean;
  error?: string;
};

export interface NotificationService {
  send(recipient: string, message: string): Promise<NotificationResult>;
}
