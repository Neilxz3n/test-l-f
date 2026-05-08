import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { ItemService } from './item.service';

describe('ItemService', () => {
  let service: ItemService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with empty items', async () => {
    const items = await firstValueFrom(service.items$);
    expect(items.length).toBe(0);
  });

  it('should add a new item', async () => {
    const item = service.addItem({
      title: 'Test Item',
      description: 'A test description',
      category: 'electronics',
      location: 'Test Location',
      date: '2026-01-01',
      type: 'lost',
      reporterName: 'Tester',
      reporterEmail: 'test@example.com',
      reporterPhone: '555-0000',
    });

    expect(item.id).toBeTruthy();
    expect(item.status).toBe('open');

    const items = await firstValueFrom(service.items$);
    expect(items.length).toBe(1);
    expect(items[0].title).toBe('Test Item');
  });

  it('should get item by id', () => {
    const item = service.addItem({
      title: 'Findable Item',
      description: 'A test description for find',
      category: 'keys',
      location: 'Somewhere',
      date: '2026-01-01',
      type: 'found',
      reporterName: 'Finder',
      reporterEmail: 'finder@example.com',
      reporterPhone: '555-1111',
    });

    const found = service.getItemById(item.id);
    expect(found).toBeTruthy();
    expect(found!.title).toBe('Findable Item');
  });

  it('should claim an item', async () => {
    const item = service.addItem({
      title: 'Claimable Item',
      description: 'Description for claiming',
      category: 'bags',
      location: 'Office',
      date: '2026-01-01',
      type: 'found',
      reporterName: 'Reporter',
      reporterEmail: 'reporter@example.com',
      reporterPhone: '555-2222',
    });

    service.claimItem(item.id, 'Claimer', 'This is my bag');

    const updated = service.getItemById(item.id);
    expect(updated!.status).toBe('claimed');
    expect(updated!.claimedBy).toBe('Claimer');
  });

  it('should resolve an item', () => {
    const item = service.addItem({
      title: 'Resolvable Item',
      description: 'Description for resolving',
      category: 'documents',
      location: 'Library',
      date: '2026-01-01',
      type: 'lost',
      reporterName: 'Reporter',
      reporterEmail: 'reporter@example.com',
      reporterPhone: '555-3333',
    });

    service.resolveItem(item.id);
    const updated = service.getItemById(item.id);
    expect(updated!.status).toBe('resolved');
  });

  it('should delete an item', async () => {
    const item = service.addItem({
      title: 'Deletable Item',
      description: 'Description for deleting',
      category: 'clothing',
      location: 'Gym',
      date: '2026-01-01',
      type: 'lost',
      reporterName: 'Reporter',
      reporterEmail: 'reporter@example.com',
      reporterPhone: '555-4444',
    });

    service.deleteItem(item.id);
    const items = await firstValueFrom(service.items$);
    expect(items.length).toBe(0);
  });

  it('should filter items by search query', async () => {
    service.addItem({
      title: 'Blue Backpack',
      description: 'Navy blue backpack',
      category: 'bags',
      location: 'Library',
      date: '2026-01-01',
      type: 'lost',
      reporterName: 'Alice',
      reporterEmail: 'alice@example.com',
      reporterPhone: '555-5555',
    });

    service.addItem({
      title: 'Red Wallet',
      description: 'Leather wallet',
      category: 'other',
      location: 'Cafeteria',
      date: '2026-01-01',
      type: 'found',
      reporterName: 'Bob',
      reporterEmail: 'bob@example.com',
      reporterPhone: '555-6666',
    });

    const results = await firstValueFrom(service.searchItems('backpack'));
    expect(results.length).toBe(1);
    expect(results[0].title).toBe('Blue Backpack');
  });

  it('should seed sample data only once', async () => {
    service.seedSampleData();
    const items1 = await firstValueFrom(service.items$);
    const count = items1.length;
    expect(count).toBeGreaterThan(0);

    service.seedSampleData();
    const items2 = await firstValueFrom(service.items$);
    expect(items2.length).toBe(count);
  });

  it('should compute stats correctly', async () => {
    service.addItem({
      title: 'Lost Phone',
      description: 'A lost phone desc',
      category: 'electronics',
      location: 'Park',
      date: '2026-01-01',
      type: 'lost',
      reporterName: 'A',
      reporterEmail: 'a@e.com',
      reporterPhone: '1',
    });
    service.addItem({
      title: 'Found Keys',
      description: 'A set of found keys',
      category: 'keys',
      location: 'Lot',
      date: '2026-01-01',
      type: 'found',
      reporterName: 'B',
      reporterEmail: 'b@e.com',
      reporterPhone: '2',
    });

    const stats = await firstValueFrom(service.getStats$());
    expect(stats.totalLost).toBe(1);
    expect(stats.totalFound).toBe(1);
    expect(stats.totalOpen).toBe(2);
    expect(stats.byCategory['electronics']).toBe(1);
    expect(stats.byCategory['keys']).toBe(1);
  });
});
