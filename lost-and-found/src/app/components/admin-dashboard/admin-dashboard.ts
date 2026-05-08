import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ItemService } from '../../services/item.service';
import { EmailService } from '../../services/email.service';
import { NotificationService } from '../../services/notification.service';
import { Item, ITEM_CATEGORIES } from '../../models/item.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboardComponent implements OnInit {
  private itemService = inject(ItemService);
  private emailService = inject(EmailService);
  private notificationService = inject(NotificationService);

  stats$ = this.itemService.getStats$();
  allItems$!: Observable<Item[]>;
  categories = ITEM_CATEGORIES;

  ngOnInit(): void {
    this.itemService.seedSampleData();
    this.allItems$ = this.itemService.searchItems('');
  }

  getCategoryIcon(category: string): string {
    return this.categories.find((c) => c.value === category)?.icon ?? '📦';
  }

  getCategoryLabel(category: string): string {
    return this.categories.find((c) => c.value === category)?.label ?? category;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  formatDateTime(dateStr: string): string {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  approveClaim(event: Event, item: Item): void {
    event.preventDefault();
    event.stopPropagation();
    this.itemService.resolveItem(item.id);
    const email = this.emailService.sendClaimApprovalEmail(item);
    this.notificationService.show(
      `Claim approved! Email sent to ${email.toName} (${email.to}).`,
      'success'
    );
  }

  resolveItem(event: Event, id: string): void {
    event.preventDefault();
    event.stopPropagation();
    this.itemService.resolveItem(id);
    this.notificationService.show('Item marked as resolved.', 'success');
  }

  deleteItem(event: Event, id: string, title: string): void {
    event.preventDefault();
    event.stopPropagation();
    if (confirm(`Delete "${title}"? This cannot be undone.`)) {
      this.itemService.deleteItem(id);
      this.notificationService.show(`"${title}" deleted.`, 'info');
    }
  }
}
