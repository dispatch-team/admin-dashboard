import { describe, it, expect, vi, beforeEach } from 'vitest';
import { login, registerMerchant, isTokenExpired, extractUserInfo } from '@/lib/auth';

describe('auth lib extra coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('login', () => {
    it('throws NETWORK_ERROR on fetch failure', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));
      await expect(login('user', 'pass')).rejects.toEqual(expect.objectContaining({
        code: 'NETWORK_ERROR'
      }));
    });

    it('throws ACCOUNT_DISABLED when error description contains disabled', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'invalid_grant', error_description: 'Account is disabled' })
      });
      await expect(login('user', 'pass')).rejects.toEqual(expect.objectContaining({
        code: 'ACCOUNT_DISABLED'
      }));
    });

    it('throws ACCOUNT_LOCKED when error description contains locked', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'invalid_grant', error_description: 'Account is locked' })
      });
      await expect(login('user', 'pass')).rejects.toEqual(expect.objectContaining({
        code: 'ACCOUNT_LOCKED'
      }));
    });

    it('throws UNKNOWN on unauthorized_client', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'unauthorized_client' })
      });
      await expect(login('user', 'pass')).rejects.toEqual(expect.objectContaining({
        code: 'UNKNOWN'
      }));
    });

    it('throws UNKNOWN on other errors', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'some_other_error' })
      });
      await expect(login('user', 'pass')).rejects.toEqual(expect.objectContaining({
        code: 'UNKNOWN'
      }));
    });
  });

  describe('registerMerchant', () => {
    it('throws NETWORK_ERROR on fetch failure', async () => {
      (global.fetch as any).mockRejectedValue(new Error('Network error'));
      await expect(registerMerchant({})).rejects.toEqual(expect.objectContaining({
        code: 'NETWORK_ERROR'
      }));
    });

    it('throws UNKNOWN on registration failure', async () => {
      (global.fetch as any).mockResolvedValue({
        ok: false,
        json: async () => ({ message: 'Failed' })
      });
      await expect(registerMerchant({})).rejects.toEqual(expect.objectContaining({
        code: 'UNKNOWN',
        message: 'Failed'
      }));
    });
  });

  describe('isTokenExpired', () => {
    it('returns true on invalid token', () => {
      expect(isTokenExpired('invalid-token')).toBe(true);
    });

    it('returns true if token is about to expire (within 30s)', () => {
      const now = Math.floor(Date.now() / 1000);
      const payload = btoa(JSON.stringify({ exp: now + 20 }));
      const token = `header.${payload}.signature`;
      expect(isTokenExpired(token)).toBe(true);
    });

    it('returns false if token is valid and not expiring soon', () => {
      const now = Math.floor(Date.now() / 1000);
      const payload = btoa(JSON.stringify({ exp: now + 3600 }));
      const token = `header.${payload}.signature`;
      expect(isTokenExpired(token)).toBe(false);
    });
  });

  describe('extractUserInfo', () => {
    it('extracts info correctly with resource access', async () => {
      const MOCK_CLIENT_ID = 'extra-test-client';
      vi.stubEnv('NEXT_PUBLIC_KEYCLOAK_CLIENT_ID', MOCK_CLIENT_ID);
      vi.resetModules();
      const { extractUserInfo } = await import('@/lib/auth');

      const payload = btoa(JSON.stringify({
        sub: '123',
        email: 'test@example.com',
        name: 'Test User',
        preferred_username: 'testuser',
        given_name: 'Test',
        family_name: 'User',
        resource_access: {
          [MOCK_CLIENT_ID]: {
            roles: ['admin']
          }
        }
      }));
      const token = `header.${payload}.signature`;
      const userInfo = extractUserInfo(token);
      expect(userInfo.roles).toEqual(['admin']);
      expect(userInfo.email).toBe('test@example.com');
    });

    it('handles token padding in parseJwtPayload', async () => {
       const { extractUserInfo } = await import('@/lib/auth');
       // Create a payload that needs padding (length not multiple of 4)
       // "abc" -> length 3, needs padding
       const data = { sub: '123' };
       const payload = btoa(JSON.stringify(data)).replace(/=/g, '');
       // Ensure payload length % 4 !== 0
       const token = `header.${payload}.signature`;
       const userInfo = extractUserInfo(token);
       expect(userInfo.sub).toBe('123');
    });
  });
});
