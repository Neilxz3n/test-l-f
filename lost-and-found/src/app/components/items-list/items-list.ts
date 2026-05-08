import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, Observable, debounceTime, switchMap, startWith, combineLatest } from 'rxjs';
import { ItemService } from '../../services/item.service';
import { Item, ITEM_CATEGORIES, ItemCategory, ItemStatus, ItemType } from '../../models/item.model';

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [AsyncPipe, FormsModule, RouterLink],
  templateUrl: './items-list.html',
  styleUrl: './items-list.scss',
})
export class ItemsListComponent implements OnInit, OnDestroy {
  private itemService = inject(ItemService);
  private searchSubject = new Subject<string>();
  private filterSubject = new Subject<void>();

  categories = ITEM_CATEGORIES;
  searchQuery = '';
  filterType: ItemType | '' = '';
  filterCategory: ItemCategory | '' = '';
  filterStatus: ItemStatus | '' = '';
  filteredItems$!: Observable<Item[]>;

  ngOnInit(): void {
    const search$ = this.searchSubject.pipe(startWith(''), debounceTime(300));
    const filter$ = this.filterSubject.pipe(startWith(undefined));

    this.filteredItems$ = combineLatest([search$, filter$]).pipe(
      switchMap(([query]) =>
        this.itemService.searchItems(
          query,
          this.filterType as ItemType || undefined,
          this.filterCategory as ItemCategory || undefined,
          this.filterStatus as ItemStatus || undefined
        )
      )
    );
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
    this.filterSubject.complete();
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchQuery);
  }

  onFilterChange(): void {
    this.filterSubject.next();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterType = '';
    this.filterCategory = '';
    this.filterStatus = '';
    this.searchSubject.next('');
    this.filterSubject.next();
  }

  getCategoryIcon(category: string): string {
    return this.categories.find((c) => c.value === category)?.icon ?? '📦';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return this.formatDate(dateStr);
  }
}
