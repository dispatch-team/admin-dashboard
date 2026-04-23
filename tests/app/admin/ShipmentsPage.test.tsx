import { render, screen, fireEvent, waitFor } from '@test/utils';
import AdminShipmentsPage from '@/app/admin/shipments/page';
import { useAuth } from '@/context/AuthContext';
import { getShipments } from '@/lib/shipments';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/context/AuthContext')>();
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

vi.mock('@/lib/shipments', () => ({
  getShipments: vi.fn(),
}));

describe('AdminShipmentsPage', () => {
  const mockGetValidAccessToken = vi.fn();
  const mockShipments = [
    {
      id: '1',
      code: 'SHP001',
      status: 'pending',
      total_fee: 500,
      weight_kg: 5,
      created_at: '2026-04-20T10:00:00Z',
      merchant: { company_name: 'Merchant A' },
      start_address: 'Pickup A',
      end_address: 'Delivery A',
      description: 'Shipment 1',
      items: [{}, {}],
    },
    {
      id: '2',
      code: 'SHP002',
      status: 'delivered',
      total_fee: 750,
      weight_kg: 2,
      created_at: '2026-04-21T11:00:00Z',
      merchant: { company_name: 'Merchant B' },
      start_address: 'Pickup B',
      end_address: 'Delivery B',
      description: 'Shipment 2',
      items: [{}],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      getValidAccessToken: mockGetValidAccessToken,
    });
    mockGetValidAccessToken.mockResolvedValue('test-token');
    (getShipments as any).mockResolvedValue({
      shipments: mockShipments,
      total: 2,
      page: 1,
      page_size: 15,
    });
  });

  it('renders shipments list', async () => {
    render(<AdminShipmentsPage />);

    expect(screen.getByRole('heading', { name: /Shipments/i })).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByText('SHP001')).toBeInTheDocument();
      expect(screen.getByText('SHP002')).toBeInTheDocument();
      expect(screen.getByText('Merchant A')).toBeInTheDocument();
      expect(screen.getByText('Merchant B')).toBeInTheDocument();
    });
  });

  it('handles search locally', async () => {
    render(<AdminShipmentsPage />);
    
    await waitFor(() => {
      expect(screen.getByText('SHP001')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search/i);
    fireEvent.change(searchInput, { target: { value: 'SHP001' } });
    
    const searchButton = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchButton);

    expect(screen.getByText('SHP001')).toBeInTheDocument();
    expect(screen.queryByText('SHP002')).not.toBeInTheDocument();
  });

  it('shows shipment details in dialog', async () => {
    render(<AdminShipmentsPage />);

    await waitFor(() => {
      const row = screen.getByText('SHP001');
      fireEvent.click(row);
    });

    await waitFor(() => {
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'SHP001' })).toBeInTheDocument();
      expect(screen.getByText('Pickup A')).toBeInTheDocument();
      expect(screen.getByText('Delivery A')).toBeInTheDocument();
    });
  });

  it('handles pagination', async () => {
    (getShipments as any).mockResolvedValue({
      shipments: mockShipments,
      total: 50,
      page: 1,
      page_size: 15,
    });

    render(<AdminShipmentsPage />);

    const nextButton = await screen.findByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(getShipments).toHaveBeenCalledWith('test-token', expect.objectContaining({ page: 2 }));
    });
  });

  it('handles fetch errors', async () => {
    (getShipments as any).mockRejectedValue(new Error('API error'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<AdminShipmentsPage />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });
    consoleSpy.mockRestore();
  });
});
