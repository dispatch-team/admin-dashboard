import { render, screen, fireEvent, waitFor } from '@test/utils';
import CouriersPage from '@/app/admin/couriers/page';
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

describe('CouriersPage', () => {
  const mockGetValidAccessToken = vi.fn();
  const mockCouriers = [
    {
      id: 1,
      company_name: 'Test Courier',
      email: 'test@courier.com',
      phone_number: '1234567890',
      status: 'active',
      company_address: '123 Test St',
      website_url: 'https://test.com',
      rating_aggregate: 45,
      rating_count: 10,
      base_price: 100,
      max_weight: 50,
    },
    {
      id: 2,
      company_name: 'Banned Courier',
      email: 'banned@courier.com',
      phone_number: '0987654321',
      status: 'banned',
      company_address: '456 Banned St',
      website_url: '',
      rating_aggregate: 0,
      rating_count: 0,
      base_price: 150,
      max_weight: 30,
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
        data: mockCouriers,
        total: 2,
        page: 1,
        page_size: 15,
        total_pages: 1,
      }),
    });
  });

  it('renders couriers list', async () => {
    render(<CouriersPage />);

    expect(screen.getByRole('heading', { name: 'Couriers' })).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('Test Courier')).toBeInTheDocument();
      expect(screen.getByText('Banned Courier')).toBeInTheDocument();
    });
  });

  it('handles search', async () => {
    render(<CouriersPage />);
    
    const searchInput = screen.getByPlaceholderText(/Search couriers/i);
    fireEvent.change(searchInput, { target: { value: 'Test' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('company_name=Test'), expect.any(Object));
    });
  });

  it('updates courier status', async () => {
    render(<CouriersPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Courier')).toBeInTheDocument();
    });

    // Find the actions button for the first courier
    const actionButtons = screen.getAllByTestId('dropdown-trigger');
    fireEvent.click(actionButtons[0]);

    const banOption = screen.getByText(/Restrict Courier/i);
    fireEvent.click(banOption);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/admin/couriers/1/status'),
        expect.objectContaining({ method: 'PATCH' })
      );
    });
    expect(toast.success).toHaveBeenCalled();
  });

  it('shows courier details in dialog', async () => {
    render(<CouriersPage />);

    await waitFor(() => {
      const row = screen.getByText('Test Courier');
      fireEvent.click(row);
    });

    await waitFor(() => {
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
      // Use heading with exact name to avoid ambiguity
      expect(screen.getByRole('heading', { name: 'Test Courier' })).toBeInTheDocument();
      expect(screen.getByText('123 Test St')).toBeInTheDocument();
    });
  });

  it('handles pagination', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: mockCouriers,
        total: 50,
        page: 1,
        page_size: 15,
        total_pages: 4,
      }),
    });

    render(<CouriersPage />);

    const nextButton = await screen.findByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('page=2'), expect.any(Object));
    });
  });

  it('handles fetch errors', async () => {
    mockFetch.mockRejectedValue(new Error('API error'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<CouriersPage />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    consoleSpy.mockRestore();
  });

  it('handles empty data', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [],
        total: 0,
        page: 1,
        page_size: 15,
        total_pages: 0,
      }),
    });

    render(<CouriersPage />);

    await waitFor(() => {
      expect(screen.getByText(/noResults|No couriers found/i)).toBeInTheDocument();
    });
  });
});
