import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const MOCK_CLIENT_ID = 'test-client';

describe('auth lib', () => {
  let auth: any;

  beforeEach(async () => {
    vi.stubEnv('NEXT_PUBLIC_KEYCLOAK_CLIENT_ID', MOCK_CLIENT_ID);
    vi.stubGlobal('fetch', vi.fn());
    
    // Use dynamic import to ensure environment variable is set before module evaluation
    vi.resetModules();
    auth = await import('@/lib/auth');
    
    if (!global.atob) {
      global.atob = vi.fn((str) => Buffer.from(str, 'base64').toString('binary'));
    }
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    localStorage.clear();
    document.cookie = '';
  });

  describe('extractUserInfo', () => {
    it('extracts user info and roles correctly', () => {
      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        preferred_username: 'testuser',
        given_name: 'Test',
        family_name: 'User',
        resource_access: {
          [MOCK_CLIENT_ID]: {
            roles: ['admin', 'merchant']
          }
        }
      };
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      
      const info = auth.extractUserInfo(token);
      
      expect(info.sub).toBe('user-123');
      expect(info.roles).toContain('admin');
      expect(info.roles).toContain('merchant');
    });
  });

  describe('isTokenExpired', () => {
    it('returns false for non-expired token', () => {
      const now = Math.floor(Date.now() / 1000);
      const payload = { exp: now + 3600 }; // 1 hour in future
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      
      expect(auth.isTokenExpired(token)).toBe(false);
    });

    it('returns true for expired token', () => {
      const now = Math.floor(Date.now() / 1000);
      const payload = { exp: now - 3600 }; // 1 hour in past
      const token = `header.${btoa(JSON.stringify(payload))}.signature`;
      
      expect(auth.isTokenExpired(token)).toBe(true);
    });
  });

  describe('login', () => {
    it('returns tokens on successful login', async () => {
      const mockTokens = { access_token: 'acc', refresh_token: 'ref' };
      (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockTokens,
      });

      const result = await auth.login('user', 'pass');
      expect(result).toEqual(mockTokens);
    });

    it('handles unauthorized_client error', async () => {
      (fetch as any).mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'unauthorized_client' }),
      });

      await expect(auth.login('user', 'pass')).rejects.toMatchObject({
        code: 'UNKNOWN'
      });
    });

    it('handles network error during login', async () => {
      (fetch as any).mockRejectedValue(new Error('Network error'));

      await expect(auth.login('user', 'pass')).rejects.toMatchObject({
        code: 'NETWORK_ERROR'
      });
    });
  });

  describe('refreshAccessToken', () => {
    it('returns new tokens on success', async () => {
      const mockTokens = { access_token: 'new-acc', refresh_token: 'new-ref' };
      (fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockTokens,
      });

      const result = await auth.refreshAccessToken('old-ref');
      expect(result).toEqual(mockTokens);
    });

    it('throws error on failure', async () => {
      (fetch as any).mockResolvedValue({ ok: false });
      await expect(auth.refreshAccessToken('old-ref')).rejects.toThrow('Token refresh failed');
    });
  });

  describe('logout', () => {
    it('calls logout API', async () => {
      await auth.logout('ref-token');
      expect(fetch).toHaveBeenCalledWith('/api/auth/logout', expect.objectContaining({
        method: 'POST',
      }));
    });
  });

  describe('token storage', () => {
    it('persists and retrieves tokens', () => {
      const tokens = { 
        access_token: 'acc-token', 
        refresh_token: 'ref-token',
        expires_in: 3600,
        refresh_expires_in: 7200,
        token_type: 'Bearer',
        session_state: 'state'
      };
      
      auth.persistTokens(tokens);
      
      const stored = auth.getStoredTokens();
      expect(stored.accessToken).toBe('acc-token');
      expect(stored.refreshToken).toBe('ref-token');
    });
  });

  describe('registerMerchant', () => {
    it('handles registration failure', async () => {
      (fetch as any).mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Conflict', message: 'User already exists' }),
      });

      await expect(auth.registerMerchant({})).rejects.toMatchObject({
        message: 'User already exists'
      });
    });
  });
});
