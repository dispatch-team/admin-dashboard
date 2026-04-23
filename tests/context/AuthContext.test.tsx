import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import * as authLib from '@/lib/auth';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import React from 'react';

// Mock lib/auth.ts
vi.mock('@/lib/auth', () => ({
  extractUserInfo: vi.fn(),
  isTokenExpired: vi.fn(),
  refreshAccessToken: vi.fn(),
  logout: vi.fn(),
  persistTokens: vi.fn(),
  getStoredTokens: vi.fn(),
  clearStoredTokens: vi.fn(),
}));

global.atob = vi.fn((str) => Buffer.from(str, 'base64').toString('binary'));

const TestComponent = () => {
  const { isAuthenticated, isLoading, user, logout, setTokens } = useAuth() as any;
  if (isLoading) return <div data-testid="loading">Loading...</div>;
  return (
    <div>
      <span data-testid="auth-state">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</span>
      <span data-testid="username">{user?.preferred_username}</span>
      <button onClick={() => setTokens({ access_token: 'valid-token', refresh_token: 'refresh-token' })}>
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (authLib.getStoredTokens as any).mockReturnValue({ accessToken: null, refreshToken: null });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes as not authenticated when no tokens exist', async () => {
    render(<AuthProvider><TestComponent /></AuthProvider>);
    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('Not Authenticated');
    });
  });

  it('initializes as authenticated if valid token exists', async () => {
    const mockUser = { preferred_username: 'testuser' };
    (authLib.getStoredTokens as any).mockReturnValue({ accessToken: 'v', refreshToken: 'r' });
    (authLib.isTokenExpired as any).mockReturnValue(false);
    (authLib.extractUserInfo as any).mockReturnValue(mockUser);

    render(<AuthProvider><TestComponent /></AuthProvider>);
    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('Authenticated');
      expect(screen.getByTestId('username')).toHaveTextContent('testuser');
    });
  });

  it('handles refresh failure on mount', async () => {
    (authLib.getStoredTokens as any).mockReturnValue({ accessToken: 'e', refreshToken: 'r' });
    (authLib.isTokenExpired as any).mockReturnValue(true);
    (authLib.refreshAccessToken as any).mockRejectedValue(new Error('Fail'));

    render(<AuthProvider><TestComponent /></AuthProvider>);
    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('Not Authenticated');
      expect(authLib.clearStoredTokens).toHaveBeenCalled();
    });
  });

  it('getValidAccessToken returns existing token if valid', async () => {
    (authLib.getStoredTokens as any).mockReturnValue({ accessToken: 'v', refreshToken: 'r' });
    (authLib.isTokenExpired as any).mockReturnValue(false);

    let token: string | null = null;
    const TokenFetcher = () => {
      const { getValidAccessToken } = useAuth();
      return <button onClick={async () => { token = await getValidAccessToken(); }}>Fetch</button>;
    };

    render(<AuthProvider><TokenFetcher /></AuthProvider>);
    fireEvent.click(screen.getByText('Fetch'));
    await waitFor(() => { expect(token).toBe('v'); });
  });

  it('schedules token refresh', async () => {
    vi.useFakeTimers();
    const now = Date.now();
    const exp = Math.floor(now / 1000) + 3600;
    const payload = btoa(JSON.stringify({ exp }));
    const token = `header.${payload}.signature`;
    
    (authLib.getStoredTokens as any).mockReturnValue({ accessToken: token, refreshToken: 'r' });
    (authLib.isTokenExpired as any).mockReturnValue(false);
    (authLib.extractUserInfo as any).mockReturnValue({ preferred_username: 'u' });
    (authLib.refreshAccessToken as any).mockResolvedValue({ access_token: 'new', refresh_token: 'nr' });

    render(<AuthProvider><TestComponent /></AuthProvider>);
    
    await act(async () => {
      vi.advanceTimersByTime(3540000);
    });

    expect(authLib.refreshAccessToken).toHaveBeenCalledWith('r');
  });

  it('handles login via setTokens', async () => {
    (authLib.extractUserInfo as any).mockReturnValue({ preferred_username: 'newuser' });

    render(<AuthProvider><TestComponent /></AuthProvider>);
    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('Not Authenticated');
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Login'));
    });

    expect(authLib.persistTokens).toHaveBeenCalled();
    expect(screen.getByTestId('auth-state')).toHaveTextContent('Authenticated');
  });

  it('handles logout', async () => {
    (authLib.getStoredTokens as any).mockReturnValue({ accessToken: 'v', refreshToken: 'r' });
    (authLib.isTokenExpired as any).mockReturnValue(false);
    (authLib.extractUserInfo as any).mockReturnValue({ preferred_username: 'u' });

    render(<AuthProvider><TestComponent /></AuthProvider>);
    await waitFor(() => {
      expect(screen.getByTestId('auth-state')).toHaveTextContent('Authenticated');
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Logout'));
    });

    expect(authLib.clearStoredTokens).toHaveBeenCalled();
    expect(screen.getByTestId('auth-state')).toHaveTextContent('Not Authenticated');
  });
});
