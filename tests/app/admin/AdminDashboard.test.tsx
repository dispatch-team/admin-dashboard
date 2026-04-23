import { render, screen, waitFor } from '@test/utils';
import AdminDashboard from '@/app/admin/page';
import { useAuth } from '@/context/AuthContext';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/context/AuthContext')>();
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('AdminDashboard', () => {
  const mockGetValidAccessToken = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      getValidAccessToken: mockGetValidAccessToken,
    });
    mockGetValidAccessToken.mockResolvedValue('test-token');
    
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('/api/admin/merchants')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ total: 10 }),
        });
      }
      if (url.includes('/api/admin/couriers')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ total: 5 }),
        });
      }
      if (url.includes('/api/shipments')) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ total: 100 }),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });
  });

  it('renders dashboard with stats', async () => {
    render(<AdminDashboard />);

    expect(screen.getByText(/Overview/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument(); // Merchants
      expect(screen.getByText('5')).toBeInTheDocument();  // Couriers
      expect(screen.getByText('100')).toBeInTheDocument(); // Shipments
    });
  });

  it('handles fetch error gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('Fetch failed'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    consoleSpy.mockRestore();
  });
});
