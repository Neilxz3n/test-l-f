export interface EmailNotification {
  id: string;
  to: string;
  toName: string;
  subject: string;
  body: string;
  sentAt: string;
  read: boolean;
  itemId: string;
  itemTitle: string;
}
