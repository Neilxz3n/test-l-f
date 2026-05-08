import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-email-inbox',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './email-inbox.html',
  styleUrl: './email-inbox.scss',
})
export class EmailInboxComponent {
  emailService = inject(EmailService);
  emails$ = this.emailService.emails$;
  expandedId: string | null = null;

  toggleEmail(id: string): void {
    if (this.expandedId === id) {
      this.expandedId = null;
    } else {
      this.expandedId = id;
      this.emailService.markAsRead(id);
    }
  }

  markAllRead(): void {
    this.emailService.markAllAsRead();
  }

  formatDateTime(dateStr: string): string {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }
}
