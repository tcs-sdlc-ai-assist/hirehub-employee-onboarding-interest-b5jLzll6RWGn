import { describe, it, expect } from 'vitest';
import {
  validateName,
  validateEmail,
  validateMobile,
  validateDepartment,
  ALLOWED_DEPARTMENTS,
} from './validators';

describe('validators', () => {
  describe('validateName', () => {
    it('returns error for empty string', () => {
      expect(validateName('')).toBe('Full name is required.');
    });

    it('returns error for null/undefined', () => {
      expect(validateName(null)).toBe('Full name is required.');
      expect(validateName(undefined)).toBe('Full name is required.');
    });

    it('returns error for whitespace-only string', () => {
      expect(validateName('   ')).toBe('Full name is required.');
    });

    it('returns error for name shorter than 2 characters', () => {
      expect(validateName('A')).toBe('Full name must be at least 2 characters.');
    });

    it('returns error for single character with surrounding whitespace', () => {
      expect(validateName(' A ')).toBe('Full name must be at least 2 characters.');
    });

    it('returns empty string for valid name with 2 characters', () => {
      expect(validateName('Al')).toBe('');
    });

    it('returns empty string for valid full name', () => {
      expect(validateName('John Doe')).toBe('');
    });

    it('returns empty string for valid name with leading/trailing spaces', () => {
      expect(validateName('  Jane Smith  ')).toBe('');
    });
  });

  describe('validateEmail', () => {
    it('returns error for empty string', () => {
      expect(validateEmail('')).toBe('Email is required.');
    });

    it('returns error for null/undefined', () => {
      expect(validateEmail(null)).toBe('Email is required.');
      expect(validateEmail(undefined)).toBe('Email is required.');
    });

    it('returns error for whitespace-only string', () => {
      expect(validateEmail('   ')).toBe('Email is required.');
    });

    it('returns error for email without @ symbol', () => {
      expect(validateEmail('invalidemail.com')).toBe('Please enter a valid email address.');
    });

    it('returns error for email without domain', () => {
      expect(validateEmail('user@')).toBe('Please enter a valid email address.');
    });

    it('returns error for email without TLD', () => {
      expect(validateEmail('user@domain')).toBe('Please enter a valid email address.');
    });

    it('returns error for email with spaces', () => {
      expect(validateEmail('user @example.com')).toBe('Please enter a valid email address.');
    });

    it('returns empty string for valid email', () => {
      expect(validateEmail('user@example.com')).toBe('');
    });

    it('returns empty string for valid email with subdomain', () => {
      expect(validateEmail('user@mail.example.com')).toBe('');
    });

    it('returns empty string for valid email with leading/trailing spaces', () => {
      expect(validateEmail('  user@example.com  ')).toBe('');
    });
  });

  describe('validateMobile', () => {
    it('returns error for empty string', () => {
      expect(validateMobile('')).toBe('Mobile number is required.');
    });

    it('returns error for null/undefined', () => {
      expect(validateMobile(null)).toBe('Mobile number is required.');
      expect(validateMobile(undefined)).toBe('Mobile number is required.');
    });

    it('returns error for whitespace-only string', () => {
      expect(validateMobile('   ')).toBe('Mobile number is required.');
    });

    it('returns error for number with fewer than 10 digits', () => {
      expect(validateMobile('123456789')).toBe('Mobile number must be exactly 10 digits.');
    });

    it('returns error for number with more than 10 digits', () => {
      expect(validateMobile('12345678901')).toBe('Mobile number must be exactly 10 digits.');
    });

    it('returns error for non-numeric characters', () => {
      expect(validateMobile('12345abcde')).toBe('Mobile number must be exactly 10 digits.');
    });

    it('returns error for number with dashes', () => {
      expect(validateMobile('123-456-7890')).toBe('Mobile number must be exactly 10 digits.');
    });

    it('returns error for number with spaces', () => {
      expect(validateMobile('123 456 7890')).toBe('Mobile number must be exactly 10 digits.');
    });

    it('returns empty string for valid 10-digit number', () => {
      expect(validateMobile('1234567890')).toBe('');
    });

    it('returns empty string for valid 10-digit number with leading/trailing spaces', () => {
      expect(validateMobile('  1234567890  ')).toBe('');
    });
  });

  describe('validateDepartment', () => {
    it('returns error for empty string', () => {
      expect(validateDepartment('')).toBe('Department is required.');
    });

    it('returns error for null/undefined', () => {
      expect(validateDepartment(null)).toBe('Department is required.');
      expect(validateDepartment(undefined)).toBe('Department is required.');
    });

    it('returns error for whitespace-only string', () => {
      expect(validateDepartment('   ')).toBe('Department is required.');
    });

    it('returns error for department not in allowed list', () => {
      expect(validateDepartment('Accounting')).toBe('Please select a valid department.');
    });

    it('returns error for department with wrong casing', () => {
      expect(validateDepartment('engineering')).toBe('Please select a valid department.');
    });

    it('returns empty string for each valid department', () => {
      ALLOWED_DEPARTMENTS.forEach((dept) => {
        expect(validateDepartment(dept)).toBe('');
      });
    });

    it('returns empty string for valid department with leading/trailing spaces', () => {
      expect(validateDepartment('  Engineering  ')).toBe('');
    });
  });
});