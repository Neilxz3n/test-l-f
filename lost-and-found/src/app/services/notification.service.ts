import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private counter = 0;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const notification: Notification = { id: ++this.counter, message, type };
    this.notificationsSubject.next([...this.notificationsSubject.value, notification]);
    setTimeout(() => this.dismiss(notification.id), 4000);
  }

  dismiss(id: number): void {
    this.notificationsSubject.next(this.notificationsSubject.value.filter((n) => n.id !== id));
  }
}
