import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { EmailService } from './email.service';
import { Item } from '../models/item.model';

describe('EmailService', () => {
  let service: EmailService;

  const mockClaimedItem: Item = {
    id: 'item_test_1',
    title: 'Test Laptop',
    description: 'A test laptop',
    category: 'electronics',
    location: 'Office',
    date: '2026-01-01',
    reportedDate: '2026-01-01T00:00:00Z',
    status: 'claimed',
    type: 'found',
    reporterName: 'Reporter Person',
    reporterEmail: 'reporter@example.com',
    reporterPhone: '555-1234',
    claimedBy: 'John Claimer',
    claimDate: '2026-01-02T00:00:00Z',
    claimDescription: 'This is my laptop, it has a dent on the corner.',
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start with no emails', async () => {
    const emails = await firstValueFrom(service.emails$);
    expect(emails.length).toBe(0);
  });

  it('should send a claim approval email', async () => {
    const email = service.sendClaimApprovalEmail(mockClaimedItem);

    expect(email.to).toBe('reporter@example.com');
    expect(email.toName).toBe('John Claimer');
    expect(email.subject).toContain('Claim Approved');
    expect(email.subject).toContain('Test Laptop');
    expect(email.body).toContain('John Claimer');
    expect(email.body).toContain('Test Laptop');
    expect(email.read).toBe(false);

    const emails = await firstValueFrom(service.emails$);
    expect(emails.length).toBe(1);
  });

  it('should track unread count', async () => {
    service.sendClaimApprovalEmail(mockClaimedItem);
    service.sendClaimApprovalEmail({ ...mockClaimedItem, id: 'item_test_2', title: 'Second Item' });

    const unread = await firstValueFrom(service.unreadCount$);
    expect(unread).toBe(2);
  });

  it('should mark an email as read', async () => {
    const email = service.sendClaimApprovalEmail(mockClaimedItem);
    service.markAsRead(email.id);

    const unread = await firstValueFrom(service.unreadCount$);
    expect(unread).toBe(0);

    const emails = await firstValueFrom(service.emails$);
    expect(emails[0].read).toBe(true);
  });

  it('should mark all as read', async () => {
    service.sendClaimApprovalEmail(mockClaimedItem);
    service.sendClaimApprovalEmail({ ...mockClaimedItem, id: 'item_test_2' });

    service.markAllAsRead();
    const unread = await firstValueFrom(service.unreadCount$);
    expect(unread).toBe(0);
  });

  it('should persist emails in localStorage', () => {
    service.sendClaimApprovalEmail(mockClaimedItem);
    const stored = localStorage.getItem('lost_and_found_emails');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.length).toBe(1);
    expect(parsed[0].subject).toContain('Test Laptop');
  });
});
