export type ItemCategory =
  | 'electronics'
  | 'clothing'
  | 'documents'
  | 'keys'
  | 'bags'
  | 'jewelry'
  | 'pets'
  | 'other';

export type ItemStatus = 'open' | 'claimed' | 'resolved';

export type ItemType = 'lost' | 'found';

export interface Item {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  location: string;
  date: string;
  reportedDate: string;
  status: ItemStatus;
  type: ItemType;
  reporterName: string;
  reporterEmail: string;
  reporterPhone: string;
  imageUrl?: string;
  claimedBy?: string;
  claimDate?: string;
  claimDescription?: string;
}

export const ITEM_CATEGORIES: { value: ItemCategory; label: string; icon: string }[] = [
  { value: 'electronics', label: 'Electronics', icon: '💻' },
  { value: 'clothing', label: 'Clothing', icon: '👕' },
  { value: 'documents', label: 'Documents', icon: '📄' },
  { value: 'keys', label: 'Keys', icon: '🔑' },
  { value: 'bags', label: 'Bags & Luggage', icon: '🎒' },
  { value: 'jewelry', label: 'Jewelry', icon: '💍' },
  { value: 'pets', label: 'Pets', icon: '🐾' },
  { value: 'other', label: 'Other', icon: '📦' },
];
