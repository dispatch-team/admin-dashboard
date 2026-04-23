import { render, screen, fireEvent, waitFor } from '@test/utils';
import MerchantsPage from '@/app/admin/merchants/page';
import { useAuth } from '@/context/AuthContext';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { toast } from 'sonner';

vi.mock('@/context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/context/AuthContext')>();
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('MerchantsPage', () => {
  const mockGetValidAccessToken = vi.fn();
  const mockMerchants = [
    {
      id: 1,
      company_name: 'Test Merchant',
      email: 'test@merchant.com',
      phone_number: '1234567890',
      status: 'active',
      industry: 'Retail',
      description: 'A test merchant',
      company_address: '123 Test St',
      website_url: 'https://test.com',
    },
    {
      id: 2,
      company_name: 'Banned Merchant',
      email: 'banned@merchant.com',
      phone_number: '0987654321',
      status: 'banned',
      industry: 'Food',
      description: 'A banned merchant',
      company_address: '456 Banned St',
      website_url: '',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      getValidAccessToken: mockGetValidAccessToken,
      accessToken: 'test-token',
    });
    mockGetValidAccessToken.mockResolvedValue('test-token');
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        items: mockMerchants,
        total: 2,
        page: 1,
        page_size: 15,
        total_pages: 1,
      }),
    });
  });

  it('renders merchants list', async () => {
    render(<MerchantsPage />);

    expect(screen.getByRole('heading', { name: 'Merchants' })).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Test Merchant')).toBeInTheDocument();
      expect(screen.getByText('Banned Merchant')).toBeInTheDocument();
    });
  });

  it('handles search', async () => {
    render(<MerchantsPage />);
    
    const searchInput = screen.getByPlaceholderText(/Search merchants/i);
    fireEvent.change(searchInput, { target: { value: 'Test' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('company_name=Test'), expect.any(Object));
    });
  });

  it('updates merchant status', async () => {
    render(<MerchantsPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Merchant')).toBeInTheDocument();
    });

    // Find the actions button for the first merchant
    const actionButtons = screen.getAllByTestId('dropdown-trigger');
    fireEvent.click(actionButtons[0]);

    const banOption = screen.getByText(/Restrict Merchant/i);
    fireEvent.click(banOption);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/merchants/1/status'),
        expect.objectContaining({ method: 'PATCH' })
      );
    });
    expect(toast.success).toHaveBeenCalled();
  });

  it('shows merchant details in dialog', async () => {
    render(<MerchantsPage />);

    await waitFor(() => {
      const row = screen.getByText('Test Merchant');
      fireEvent.click(row);
    });

    await waitFor(() => {
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Test Merchant' })).toBeInTheDocument();
      expect(screen.getByText('123 Test St')).toBeInTheDocument();
    });
  });

  it('handles pagination', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        items: mockMerchants,
        total: 50,
        page: 1,
        page_size: 15,
        total_pages: 4,
      }),
    });

    render(<MerchantsPage />);

    const nextButton = await screen.findByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('page=2'), expect.any(Object));
    });
  });

  it('handles fetch errors', async () => {
    mockFetch.mockRejectedValue(new Error('API error'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<MerchantsPage />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    consoleSpy.mockRestore();
  });
});
