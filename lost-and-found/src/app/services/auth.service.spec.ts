import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to user role', () => {
    expect(service.currentRole).toBe('user');
    expect(service.isAdmin).toBe(false);
  });

  it('should switch to admin role', () => {
    service.setRole('admin');
    expect(service.currentRole).toBe('admin');
    expect(service.isAdmin).toBe(true);
  });

  it('should toggle role', () => {
    expect(service.currentRole).toBe('user');
    service.toggleRole();
    expect(service.currentRole).toBe('admin');
    service.toggleRole();
    expect(service.currentRole).toBe('user');
  });

  it('should persist role in localStorage', () => {
    service.setRole('admin');
    expect(localStorage.getItem('lost_and_found_role')).toBe('admin');
  });
});
