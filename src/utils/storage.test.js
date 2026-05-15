import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getSubmissions,
  saveSubmissions,
  addSubmission,
  updateSubmission,
  deleteSubmission,
  isEmailDuplicate,
} from './storage';

const STORAGE_KEY = 'hirehub_submissions';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('getSubmissions', () => {
    it('returns empty array when localStorage is empty', () => {
      const result = getSubmissions();
      expect(result).toEqual([]);
    });

    it('returns empty array when localStorage has null', () => {
      localStorage.removeItem(STORAGE_KEY);
      const result = getSubmissions();
      expect(result).toEqual([]);
    });

    it('returns parsed submissions when valid JSON exists', () => {
      const submissions = [
        {
          id: 'abc-123',
          fullName: 'John Doe',
          email: 'john@example.com',
          mobile: '1234567890',
          department: 'Engineering',
          submittedAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
      const result = getSubmissions();
      expect(result).toEqual(submissions);
    });

    it('handles corrupted JSON gracefully and resets to empty array', () => {
      localStorage.setItem(STORAGE_KEY, '{not valid json!!!');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = getSubmissions();
      expect(result).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEY)).toBe('[]');
      consoleSpy.mockRestore();
    });

    it('handles non-array data gracefully and resets to empty array', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ foo: 'bar' }));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = getSubmissions();
      expect(result).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEY)).toBe('[]');
      consoleSpy.mockRestore();
    });
  });

  describe('saveSubmissions', () => {
    it('persists data to localStorage', () => {
      const submissions = [
        {
          id: 'abc-123',
          fullName: 'Jane Doe',
          email: 'jane@example.com',
          mobile: '9876543210',
          department: 'Design',
          submittedAt: '2024-02-01T00:00:00.000Z',
        },
      ];
      saveSubmissions(submissions);
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored).toEqual(submissions);
    });

    it('does not save if argument is not an array', () => {
      localStorage.setItem(STORAGE_KEY, '[]');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      saveSubmissions('not an array');
      expect(localStorage.getItem(STORAGE_KEY)).toBe('[]');
      consoleSpy.mockRestore();
    });
  });

  describe('addSubmission', () => {
    it('creates entry with id and timestamp', () => {
      const submission = {
        fullName: 'Alice Smith',
        email: 'alice@example.com',
        mobile: '5551234567',
        department: 'Marketing',
      };
      const result = addSubmission(submission);
      expect(result).toHaveProperty('id');
      expect(result.id).toBeTruthy();
      expect(typeof result.id).toBe('string');
      expect(result).toHaveProperty('submittedAt');
      expect(result.submittedAt).toBeTruthy();
      expect(result.fullName).toBe('Alice Smith');
      expect(result.email).toBe('alice@example.com');
      expect(result.mobile).toBe('5551234567');
      expect(result.department).toBe('Marketing');

      const stored = getSubmissions();
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe(result.id);
    });

    it('appends to existing submissions', () => {
      const first = {
        fullName: 'First User',
        email: 'first@example.com',
        mobile: '1111111111',
        department: 'Engineering',
      };
      const second = {
        fullName: 'Second User',
        email: 'second@example.com',
        mobile: '2222222222',
        department: 'Design',
      };
      addSubmission(first);
      addSubmission(second);
      const stored = getSubmissions();
      expect(stored).toHaveLength(2);
    });

    it('throws error for duplicate email', () => {
      const submission = {
        fullName: 'Bob',
        email: 'bob@example.com',
        mobile: '3333333333',
        department: 'Sales',
      };
      addSubmission(submission);
      expect(() => {
        addSubmission({
          fullName: 'Bob Again',
          email: 'bob@example.com',
          mobile: '4444444444',
          department: 'HR',
        });
      }).toThrow('Duplicate email');
    });
  });

  describe('updateSubmission', () => {
    it('modifies the correct entry', () => {
      const submission = addSubmission({
        fullName: 'Update Me',
        email: 'update@example.com',
        mobile: '5555555555',
        department: 'Finance',
      });

      const updated = updateSubmission(submission.id, {
        fullName: 'Updated Name',
        department: 'Operations',
      });

      expect(updated.fullName).toBe('Updated Name');
      expect(updated.department).toBe('Operations');
      expect(updated.email).toBe('update@example.com');
      expect(updated.id).toBe(submission.id);

      const stored = getSubmissions();
      const found = stored.find((s) => s.id === submission.id);
      expect(found.fullName).toBe('Updated Name');
      expect(found.department).toBe('Operations');
    });

    it('returns null for non-existent id', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = updateSubmission('non-existent-id', { fullName: 'Nope' });
      expect(result).toBeNull();
      consoleSpy.mockRestore();
    });

    it('does not modify other entries', () => {
      const first = addSubmission({
        fullName: 'First',
        email: 'first@test.com',
        mobile: '1111111111',
        department: 'Engineering',
      });
      const second = addSubmission({
        fullName: 'Second',
        email: 'second@test.com',
        mobile: '2222222222',
        department: 'Design',
      });

      updateSubmission(first.id, { fullName: 'First Updated' });

      const stored = getSubmissions();
      const secondStored = stored.find((s) => s.id === second.id);
      expect(secondStored.fullName).toBe('Second');
    });
  });

  describe('deleteSubmission', () => {
    it('removes the correct entry', () => {
      const first = addSubmission({
        fullName: 'Keep Me',
        email: 'keep@example.com',
        mobile: '1111111111',
        department: 'Engineering',
      });
      const second = addSubmission({
        fullName: 'Delete Me',
        email: 'delete@example.com',
        mobile: '2222222222',
        department: 'Design',
      });

      const result = deleteSubmission(second.id);
      expect(result).toBe(true);

      const stored = getSubmissions();
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe(first.id);
    });

    it('returns false for non-existent id', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = deleteSubmission('non-existent-id');
      expect(result).toBe(false);
      consoleSpy.mockRestore();
    });
  });

  describe('isEmailDuplicate', () => {
    it('detects duplicate emails correctly', () => {
      addSubmission({
        fullName: 'Test User',
        email: 'test@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      expect(isEmailDuplicate('test@example.com')).toBe(true);
      expect(isEmailDuplicate('TEST@EXAMPLE.COM')).toBe(true);
      expect(isEmailDuplicate(' test@example.com ')).toBe(true);
    });

    it('returns false for non-existing email', () => {
      expect(isEmailDuplicate('nonexistent@example.com')).toBe(false);
    });

    it('excludes a specific id from the duplicate check', () => {
      const submission = addSubmission({
        fullName: 'Exclude Me',
        email: 'exclude@example.com',
        mobile: '9999999999',
        department: 'HR',
      });

      expect(isEmailDuplicate('exclude@example.com', submission.id)).toBe(false);
      expect(isEmailDuplicate('exclude@example.com')).toBe(true);
    });
  });
});