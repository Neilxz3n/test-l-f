import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type UserRole = 'admin' | 'user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly ROLE_KEY = 'lost_and_found_role';
  private roleSubject = new BehaviorSubject<UserRole>(this.loadRole());

  get role$(): Observable<UserRole> {
    return this.roleSubject.asObservable();
  }

  get currentRole(): UserRole {
    return this.roleSubject.value;
  }

  get isAdmin(): boolean {
    return this.roleSubject.value === 'admin';
  }

  setRole(role: UserRole): void {
    localStorage.setItem(this.ROLE_KEY, role);
    this.roleSubject.next(role);
  }

  toggleRole(): void {
    this.setRole(this.isAdmin ? 'user' : 'admin');
  }

  private loadRole(): UserRole {
    const stored = localStorage.getItem(this.ROLE_KEY);
    return stored === 'admin' ? 'admin' : 'user';
  }
}
