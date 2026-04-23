import { 
  normalizeMerchantProfile, 
  sanitizeLogoIdForProxy, 
  buildMerchantLogoProxyUrl, 
  mergeMerchantProfileWithJwtUser,
  extractProfilePayload
} from '@/lib/merchantProfile';
import { describe, it, expect } from 'vitest';

describe('merchantProfile lib', () => {
  describe('extractProfilePayload', () => {
    it('unwraps common API envelopes', () => {
      const raw = { data: { company_name: 'Test Corp' } };
      expect(extractProfilePayload(raw)).toEqual({ company_name: 'Test Corp' });
    });

    it('returns null for non-objects', () => {
      expect(extractProfilePayload(null)).toBeNull();
      expect(extractProfilePayload(123)).toBeNull();
    });
  });

  describe('normalizeMerchantProfile', () => {
    it('normalizes flat snake_case profile', () => {
      const raw = {
        id: 1,
        company_name: 'Test Corp',
        first_name: 'John',
        last_name: 'Doe'
      };
      const normalized = normalizeMerchantProfile(raw);
      expect(normalized?.company_name).toBe('Test Corp');
      expect(normalized?.first_name).toBe('John');
    });

    it('normalizes camelCase profile', () => {
      const raw = {
        companyName: 'Test Corp',
        firstName: 'John',
        lastName: 'Doe'
      };
      const normalized = normalizeMerchantProfile(raw);
      expect(normalized?.company_name).toBe('Test Corp');
      expect(normalized?.first_name).toBe('John');
    });

    it('handles nested user objects', () => {
      const raw = {
        company_name: 'Test Corp',
        user: { first_name: 'John', last_name: 'Doe' }
      };
      const normalized = normalizeMerchantProfile(raw);
      expect(normalized?.first_name).toBe('John');
    });

    it('returns null if not looking like merchant', () => {
      expect(normalizeMerchantProfile({ some: 'other' })).toBeNull();
    });
  });

  describe('sanitizeLogoIdForProxy', () => {
    it('strips prefixes', () => {
      expect(sanitizeLogoIdForProxy('api/v1/merchants/logos/abc.png')).toBe('abc.png');
      expect(sanitizeLogoIdForProxy('merchants/logos/xyz.jpg')).toBe('xyz.jpg');
    });

    it('handles full URLs', () => {
      expect(sanitizeLogoIdForProxy('http://example.com/logos/logo.png')).toBe('logos/logo.png');
    });
  });

  describe('buildMerchantLogoProxyUrl', () => {
    it('builds correct proxy URL', () => {
      const url = buildMerchantLogoProxyUrl('my/logo.png', 'token123');
      expect(url).toBe('/api/merchant/logo/my/logo.png?token=token123');
    });

    it('returns null for empty logoId', () => {
      expect(buildMerchantLogoProxyUrl('', 'token')).toBeNull();
    });
  });

  describe('mergeMerchantProfileWithJwtUser', () => {
    it('fills names from JWT if profile is empty', () => {
      const profile = { first_name: '', last_name: '' } as any;
      const user = { given_name: 'John', family_name: 'Doe' };
      const merged = mergeMerchantProfileWithJwtUser(profile, user);
      expect(merged.first_name).toBe('John');
      expect(merged.last_name).toBe('Doe');
    });

    it('prefers profile names over JWT', () => {
      const profile = { first_name: 'Original', last_name: 'Name' } as any;
      const user = { given_name: 'John', family_name: 'Doe' };
      const merged = mergeMerchantProfileWithJwtUser(profile, user);
      expect(merged.first_name).toBe('Original');
    });
  });
});
