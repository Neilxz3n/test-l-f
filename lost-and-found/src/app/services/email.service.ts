import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { EmailNotification } from '../models/email-notification.model';
import { Item } from '../models/item.model';

@Injectable({ providedIn: 'root' })
export class EmailService {
  private readonly STORAGE_KEY = 'lost_and_found_emails';
  private emailsSubject = new BehaviorSubject<EmailNotification[]>(this.loadEmails());

  get emails$(): Observable<EmailNotification[]> {
    return this.emailsSubject.asObservable();
  }

  get unreadCount$(): Observable<number> {
    return this.emails$.pipe(map((emails) => emails.filter((e) => !e.read).length));
  }

  sendClaimApprovalEmail(item: Item): EmailNotification {
    const email: EmailNotification = {
      id: `email_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      to: item.reporterEmail,
      toName: item.claimedBy ?? 'Claimant',
      subject: `Claim Approved: "${item.title}"`,
      body: this.buildApprovalBody(item),
      sentAt: new Date().toISOString(),
      read: false,
      itemId: item.id,
      itemTitle: item.title,
    };

    const emails = [email, ...this.emailsSubject.value];
    this.saveAndEmit(emails);
    return email;
  }

  markAsRead(id: string): void {
    const emails = this.emailsSubject.value.map((e) =>
      e.id === id ? { ...e, read: true } : e
    );
    this.saveAndEmit(emails);
  }

  markAllAsRead(): void {
    const emails = this.emailsSubject.value.map((e) => ({ ...e, read: true }));
    this.saveAndEmit(emails);
  }

  private buildApprovalBody(item: Item): string {
    return (
      `Dear ${item.claimedBy},\n\n` +
      `Great news! Your claim for "${item.title}" has been approved by an administrator.\n\n` +
      `Item Details:\n` +
      `  - Item: ${item.title}\n` +
      `  - Category: ${item.category}\n` +
      `  - Location: ${item.location}\n` +
      `  - Type: ${item.type === 'lost' ? 'Lost' : 'Found'}\n\n` +
      `Claim Details:\n` +
      `  - Claimed by: ${item.claimedBy}\n` +
      `  - Claim description: ${item.claimDescription}\n\n` +
      `Please contact the reporter to arrange pickup/return:\n` +
      `  - Name: ${item.reporterName}\n` +
      `  - Email: ${item.reporterEmail}\n` +
      `  - Phone: ${item.reporterPhone}\n\n` +
      `Thank you for using the Lost & Found Management System.\n\n` +
      `— Lost & Found Admin Team`
    );
  }

  private loadEmails(): EmailNotification[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveAndEmit(emails: EmailNotification[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(emails));
    this.emailsSubject.next(emails);
  }
}
