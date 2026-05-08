import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ItemService } from '../../services/item.service';
import { Item, ITEM_CATEGORIES } from '../../models/item.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AsyncPipe, SlicePipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  private itemService = inject(ItemService);

  stats$ = this.itemService.getStats$();
  recentItems$!: Observable<Item[]>;
  categories = ITEM_CATEGORIES;

  ngOnInit(): void {
    this.itemService.seedSampleData();
    this.recentItems$ = this.itemService.searchItems('');
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
}
