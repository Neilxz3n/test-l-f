import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Item, ItemCategory, ItemStatus, ItemType } from '../models/item.model';

@Injectable({ providedIn: 'root' })
export class ItemService {
  private readonly STORAGE_KEY = 'lost_and_found_items';
  private itemsSubject = new BehaviorSubject<Item[]>(this.loadItems());

  get items$(): Observable<Item[]> {
    return this.itemsSubject.asObservable();
  }

  getLostItems$(): Observable<Item[]> {
    return this.items$.pipe(map((items) => items.filter((i) => i.type === 'lost')));
  }

  getFoundItems$(): Observable<Item[]> {
    return this.items$.pipe(map((items) => items.filter((i) => i.type === 'found')));
  }

  getItemById(id: string): Item | undefined {
    return this.itemsSubject.value.find((item) => item.id === id);
  }

  getItemById$(id: string): Observable<Item | undefined> {
    return this.items$.pipe(map((items) => items.find((item) => item.id === id)));
  }

  addItem(item: Omit<Item, 'id' | 'reportedDate' | 'status'>): Item {
    const newItem: Item = {
      ...item,
      id: this.generateId(),
      reportedDate: new Date().toISOString(),
      status: 'open',
    };
    const items = [...this.itemsSubject.value, newItem];
    this.saveAndEmit(items);
    return newItem;
  }

  updateItem(id: string, updates: Partial<Item>): void {
    const items = this.itemsSubject.value.map((item) =>
      item.id === id ? { ...item, ...updates } : item
    );
    this.saveAndEmit(items);
  }

  claimItem(id: string, claimedBy: string, claimDescription: string): void {
    this.updateItem(id, {
      status: 'claimed',
      claimedBy,
      claimDate: new Date().toISOString(),
      claimDescription,
    });
  }

  resolveItem(id: string): void {
    this.updateItem(id, { status: 'resolved' });
  }

  deleteItem(id: string): void {
    const items = this.itemsSubject.value.filter((item) => item.id !== id);
    this.saveAndEmit(items);
  }

  searchItems(query: string, type?: ItemType, category?: ItemCategory, status?: ItemStatus): Observable<Item[]> {
    return this.items$.pipe(
      map((items) => {
        let filtered = items;
        if (type) {
          filtered = filtered.filter((i) => i.type === type);
        }
        if (category) {
          filtered = filtered.filter((i) => i.category === category);
        }
        if (status) {
          filtered = filtered.filter((i) => i.status === status);
        }
        if (query.trim()) {
          const q = query.toLowerCase();
          filtered = filtered.filter(
            (i) =>
              i.title.toLowerCase().includes(q) ||
              i.description.toLowerCase().includes(q) ||
              i.location.toLowerCase().includes(q)
          );
        }
        return filtered.sort(
          (a, b) => new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime()
        );
      })
    );
  }

  getStats$(): Observable<{
    totalLost: number;
    totalFound: number;
    totalClaimed: number;
    totalResolved: number;
    totalOpen: number;
    byCategory: Record<string, number>;
  }> {
    return this.items$.pipe(
      map((items) => {
        const byCategory: Record<string, number> = {};
        items.forEach((item) => {
          byCategory[item.category] = (byCategory[item.category] || 0) + 1;
        });
        return {
          totalLost: items.filter((i) => i.type === 'lost').length,
          totalFound: items.filter((i) => i.type === 'found').length,
          totalClaimed: items.filter((i) => i.status === 'claimed').length,
          totalResolved: items.filter((i) => i.status === 'resolved').length,
          totalOpen: items.filter((i) => i.status === 'open').length,
          byCategory,
        };
      })
    );
  }

  seedSampleData(): void {
    if (this.itemsSubject.value.length > 0) return;

    const sampleItems: Omit<Item, 'id' | 'reportedDate' | 'status'>[] = [
      {
        title: 'Blue Backpack',
        description: 'Navy blue Herschel backpack with a laptop inside. Has a small tear on the front pocket.',
        category: 'bags',
        location: 'Central Library, 2nd Floor',
        date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
        type: 'lost',
        reporterName: 'Alice Johnson',
        reporterEmail: 'alice@example.com',
        reporterPhone: '555-0101',
      },
      {
        title: 'iPhone 15 Pro',
        description: 'Space black iPhone 15 Pro with a cracked screen protector. Has a blue silicone case.',
        category: 'electronics',
        location: 'Cafeteria near entrance',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        type: 'found',
        reporterName: 'Bob Smith',
        reporterEmail: 'bob@example.com',
        reporterPhone: '555-0102',
      },
      {
        title: 'Car Keys with Toyota Fob',
        description: 'Toyota car key with a black fob and a small keychain of the Eiffel Tower.',
        category: 'keys',
        location: 'Parking Lot B',
        date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
        type: 'found',
        reporterName: 'Carol Davis',
        reporterEmail: 'carol@example.com',
        reporterPhone: '555-0103',
      },
      {
        title: 'Gold Wedding Ring',
        description: 'Plain gold wedding band, size 7. Engraved with initials "J+M" on the inside.',
        category: 'jewelry',
        location: 'Restroom, Building A',
        date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
        type: 'lost',
        reporterName: 'David Wilson',
        reporterEmail: 'david@example.com',
        reporterPhone: '555-0104',
      },
      {
        title: 'Student ID Card',
        description: 'University student ID card for the name "Emily Chen", student number 2024-1567.',
        category: 'documents',
        location: 'Main Auditorium',
        date: new Date().toISOString().split('T')[0],
        type: 'found',
        reporterName: 'Frank Brown',
        reporterEmail: 'frank@example.com',
        reporterPhone: '555-0105',
      },
      {
        title: 'Red Winter Jacket',
        description: 'North Face red puffer jacket, medium size. Left pocket has a pair of gloves inside.',
        category: 'clothing',
        location: 'Gym Locker Room',
        date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
        type: 'lost',
        reporterName: 'Grace Lee',
        reporterEmail: 'grace@example.com',
        reporterPhone: '555-0106',
      },
    ];

    sampleItems.forEach((item) => this.addItem(item));
  }

  private loadItems(): Item[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveAndEmit(items: Item[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    this.itemsSubject.next(items);
  }

  private generateId(): string {
    return `item_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
