import { describe, it, expect } from 'vitest';
import { 
  normalizeMerchantProfile, 
  extractProfilePayload, 
  sanitizeLogoIdForProxy, 
  buildMerchantLogoProxyUrl,
  mergeMerchantProfileWithJwtUser,
  merchantApiErrorMessage
} from '@/lib/merchantProfile';

describe('merchantProfile lib extra coverage', () => {
  describe('extractProfilePayload', () => {
    it('returns null if not an object', () => {
      expect(extractProfilePayload(null)).toBeNull();
      expect(extractProfilePayload(123)).toBeNull();
    });

    it('unwraps various envelopes', () => {
      const merchant = { company_name: 'Test' };
      expect(extractProfilePayload({ data: merchant })).toEqual(merchant);
      expect(extractProfilePayload({ profile: merchant })).toEqual(merchant);
      expect(extractProfilePayload({ merchant: merchant })).toEqual(merchant);
      expect(extractProfilePayload({ result: merchant })).toEqual(merchant);
      expect(extractProfilePayload({ payload: merchant })).toEqual(merchant);
    });

    it('returns raw if no envelope but looks like merchant', () => {
      const merchant = { company_name: 'Test' };
      expect(extractProfilePayload(merchant)).toEqual(merchant);
    });
  });

  describe('normalizeMerchantProfile', () => {
    it('handles nested user objects', () => {
      const raw = {
        company_name: 'Test Co',
        user: { first_name: 'John', last_name: 'Doe' }
      };
      const normalized = normalizeMerchantProfile(raw);
      expect(normalized?.first_name).toBe('John');
      expect(normalized?.last_name).toBe('Doe');
    });

    it('handles numeric and string IDs', () => {
       const base = { company_name: 'Test' };
       expect(normalizeMerchantProfile({ ...base, id: 123 })?.id).toBe(123);
       expect(normalizeMerchantProfile({ ...base, id: '456' })?.id).toBe(456);
       expect(normalizeMerchantProfile({ ...base, id: 'abc' })?.id).toBeUndefined();
    });

    it('handles camelCase and snake_case', () => {
      const raw = {
        companyName: 'Test Co',
        companyAddress: 'Address',
        phoneNumber: '123'
      };
      const normalized = normalizeMerchantProfile(raw);
      expect(normalized?.company_name).toBe('Test Co');
      expect(normalized?.company_address).toBe('Address');
      expect(normalized?.phone_number).toBe('123');
    });

    it('splits full name if first/last missing', () => {
      const raw = {
        company_name: 'Test Co',
        name: 'John Quincy Doe'
      };
      const normalized = normalizeMerchantProfile(raw);
      expect(normalized?.first_name).toBe('John');
      expect(normalized?.last_name).toBe('Quincy Doe');
    });

    it('handles company logo in nested object', () => {
      const raw = {
        company_name: 'Test Co',
        company_logo: { id: 'logo-123' }
      };
      const normalized = normalizeMerchantProfile(raw);
      expect(normalized?.company_logo_id).toBe('logo-123');
    });

    it('returns null if payload does not look like merchant', () => {
      expect(normalizeMerchantProfile({ foo: 'bar' })).toBeNull();
    });
  });

  describe('sanitizeLogoIdForProxy', () => {
    it('removes URL and common prefixes', () => {
      expect(sanitizeLogoIdForProxy('https://example.com/api/v1/merchants/logos/my-logo.png')).toBe('my-logo.png');
      expect(sanitizeLogoIdForProxy('v1/merchants/logos/my-logo.png/')).toBe('my-logo.png');
      expect(sanitizeLogoIdForProxy('   ')).toBe('');
      expect(sanitizeLogoIdForProxy('some-logo.png')).toBe('some-logo.png');
    });
  });

  describe('buildMerchantLogoProxyUrl', () => {
    it('returns null on empty logoId', () => {
      expect(buildMerchantLogoProxyUrl('', 'token')).toBeNull();
      expect(buildMerchantLogoProxyUrl(undefined, 'token')).toBeNull();
    });

    it('builds URL with segments and token', () => {
      const url = buildMerchantLogoProxyUrl('path/to/logo.png', 'my-token');
      expect(url).toBe('/api/merchant/logo/path/to/logo.png?token=my-token');
    });

    it('builds URL without token', () => {
      const url = buildMerchantLogoProxyUrl('logo.png', null);
      expect(url).toBe('/api/merchant/logo/logo.png');
    });
  });

  describe('mergeMerchantProfileWithJwtUser', () => {
    it('merges names if profile names are empty', () => {
      const profile = { first_name: '', last_name: '', company_name: 'Test' } as any;
      const user = { given_name: 'John', family_name: 'Doe' };
      const merged = mergeMerchantProfileWithJwtUser(profile, user);
      expect(merged.first_name).toBe('John');
      expect(merged.last_name).toBe('Doe');
    });

    it('splits user name if given/family missing', () => {
      const profile = { first_name: '', last_name: '', company_name: 'Test' } as any;
      const user = { name: 'John Doe' };
      const merged = mergeMerchantProfileWithJwtUser(profile, user);
      expect(merged.first_name).toBe('John');
      expect(merged.last_name).toBe('Doe');
    });

    it('returns same profile if no user', () => {
      const profile = { first_name: 'Existing', last_name: 'Name' } as any;
      expect(mergeMerchantProfileWithJwtUser(profile, null)).toEqual(profile);
    });
  });

  describe('merchantApiErrorMessage', () => {
    it('handles non-object bodies', () => {
      expect(merchantApiErrorMessage('error')).toBe('Request failed');
    });

    it('picks various error fields', () => {
      expect(merchantApiErrorMessage({ message: 'Msg' })).toBe('Msg');
      expect(merchantApiErrorMessage({ error: 'Err' })).toBe('Err');
      expect(merchantApiErrorMessage({ error_description: 'Desc' })).toBe('Desc');
      expect(merchantApiErrorMessage({ detail: 'Detail' })).toBe('Detail');
    });

    it('handles array of errors', () => {
      expect(merchantApiErrorMessage({ message: ['Error 1', 'Error 2'] })).toBe('Error 1, Error 2');
    });

    it('handles nested message object', () => {
      expect(merchantApiErrorMessage({ message: { message: 'Nested' } })).toBe('Nested');
    });
  });
});
