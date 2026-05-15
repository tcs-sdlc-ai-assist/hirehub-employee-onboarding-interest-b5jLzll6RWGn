import { describe, it, expect, beforeEach } from 'vitest';
import { login, logout, isAuthenticated } from './adminAuth';

const AUTH_KEY = 'hirehub_admin_auth';

describe('adminAuth', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  describe('login', () => {
    it('returns success true and sets sessionStorage for valid credentials', () => {
      const result = login('admin', 'admin');
      expect(result).toEqual({ success: true });
      expect(sessionStorage.getItem(AUTH_KEY)).toBe('true');
    });

    it('returns success false with error for invalid username', () => {
      const result = login('wronguser', 'admin');
      expect(result).toEqual({ success: false, error: 'Invalid credentials' });
      expect(sessionStorage.getItem(AUTH_KEY)).toBeNull();
    });

    it('returns success false with error for invalid password', () => {
      const result = login('admin', 'wrongpassword');
      expect(result).toEqual({ success: false, error: 'Invalid credentials' });
      expect(sessionStorage.getItem(AUTH_KEY)).toBeNull();
    });

    it('returns success false with error for both invalid username and password', () => {
      const result = login('wronguser', 'wrongpassword');
      expect(result).toEqual({ success: false, error: 'Invalid credentials' });
      expect(sessionStorage.getItem(AUTH_KEY)).toBeNull();
    });

    it('returns success false for empty credentials', () => {
      const result = login('', '');
      expect(result).toEqual({ success: false, error: 'Invalid credentials' });
      expect(sessionStorage.getItem(AUTH_KEY)).toBeNull();
    });
  });

  describe('logout', () => {
    it('clears sessionStorage auth key', () => {
      sessionStorage.setItem(AUTH_KEY, 'true');
      expect(sessionStorage.getItem(AUTH_KEY)).toBe('true');

      logout();
      expect(sessionStorage.getItem(AUTH_KEY)).toBeNull();
    });

    it('does not throw when called without being logged in', () => {
      expect(() => logout()).not.toThrow();
      expect(sessionStorage.getItem(AUTH_KEY)).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('returns true when logged in', () => {
      sessionStorage.setItem(AUTH_KEY, 'true');
      expect(isAuthenticated()).toBe(true);
    });

    it('returns false when not logged in', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('returns false when sessionStorage value is not "true"', () => {
      sessionStorage.setItem(AUTH_KEY, 'false');
      expect(isAuthenticated()).toBe(false);
    });

    it('returns false after logout', () => {
      login('admin', 'admin');
      expect(isAuthenticated()).toBe(true);

      logout();
      expect(isAuthenticated()).toBe(false);
    });
  });
});