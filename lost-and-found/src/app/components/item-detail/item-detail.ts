import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ItemService } from '../../services/item.service';
import { EmailService } from '../../services/email.service';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../../services/auth.service';
import { Item, ITEM_CATEGORIES } from '../../models/item.model';
import { ClaimDialogComponent } from '../claim-dialog/claim-dialog';

@Component({
  selector: 'app-item-detail',
  standalone: true,
  imports: [AsyncPipe, RouterLink, ClaimDialogComponent],
  templateUrl: './item-detail.html',
  styleUrl: './item-detail.scss',
})
export class ItemDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private itemService = inject(ItemService);
  private emailService = inject(EmailService);
  private notificationService = inject(NotificationService);
  authService = inject(AuthService);

  item$!: Observable<Item | undefined>;
  showClaimDialog = false;
  categories = ITEM_CATEGORIES;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.item$ = this.itemService.getItemById$(id);
  }

  getCategoryLabel(category: string): string {
    const cat = this.categories.find((c) => c.value === category);
    return cat ? `${cat.icon} ${cat.label}` : category;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
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

  openClaimDialog(): void {
    this.showClaimDialog = true;
  }

  onClaimSubmitted(data: { claimedBy: string; description: string }, itemId: string): void {
    this.itemService.claimItem(itemId, data.claimedBy, data.description);
    this.showClaimDialog = false;
    this.notificationService.show('Item claimed successfully! Awaiting admin approval.', 'success');
  }

  approveClaim(item: Item): void {
    this.itemService.resolveItem(item.id);
    const email = this.emailService.sendClaimApprovalEmail(item);
    this.notificationService.show(
      `Claim approved! Email sent to ${email.toName} (${email.to}).`,
      'success'
    );
  }

  resolveItem(id: string): void {
    this.itemService.resolveItem(id);
    this.notificationService.show('Item marked as resolved!', 'success');
  }

  deleteItem(id: string): void {
    if (confirm('Are you sure you want to delete this item report?')) {
      this.itemService.deleteItem(id);
      this.notificationService.show('Item deleted.', 'info');
      this.router.navigate([this.authService.isAdmin ? '/admin' : '/items']);
    }
  }
}
