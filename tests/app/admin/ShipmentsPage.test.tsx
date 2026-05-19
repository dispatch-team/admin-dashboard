import { render, screen, fireEvent, waitFor } from '@test/utils';
import AdminShipmentsPage from '@/app/admin/shipments/page';
import { useAuth } from '@/context/AuthContext';
import { getShipments } from '@/lib/shipments';
import { getShipmentTimeline } from '@/lib/analytics';
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

vi.mock('@/lib/analytics', () => ({
  getShipmentTimeline: vi.fn(),
}));

describe('AdminShipmentsPage', () => {
  const mockGetValidAccessToken = vi.fn();
  const mockTimeline = {
    shipment_id: 1,
    total_events: 2,
    first_event_at: '2026-01-15T08:00:00Z',
    last_event_at: '2026-01-15T10:00:00Z',
    events: [
      {
        id: 301,
        timestamp: '2026-01-15T08:00:00Z',
        action: 'create',
        user_id: 'usr_88',
        source: 'web',
        description: 'Shipment created by merchant',
        properties: {},
      },
      {
        id: 302,
        timestamp: '2026-01-15T10:00:00Z',
        action: 'deliver',
        user_id: 'usr_12',
        source: 'mobile',
        description: 'Delivered successfully',
        properties: {},
      },
    ],
  };

  // Use numeric string ids so the timeline component attempts to fetch
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

  // Shipment with a non-numeric UUID-style id
  const mockShipmentNonNumeric = {
    id: 'uuid-abc-123',
    code: 'SHP003',
    status: 'pending',
    total_fee: 300,
    weight_kg: 3,
    created_at: '2026-04-22T12:00:00Z',
    merchant: { company_name: 'Merchant C' },
    start_address: 'Pickup C',
    end_address: 'Delivery C',
    description: 'Shipment 3',
    items: [],
  };

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
    (getShipmentTimeline as any).mockResolvedValue(mockTimeline);
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

  it('calls getShipmentTimeline when dialog opens for a numeric-id shipment', async () => {
    render(<AdminShipmentsPage />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('SHP001'));
    });

    await waitFor(() => {
      expect(getShipmentTimeline).toHaveBeenCalledWith('test-token', '1');
    });
  });

  it('renders timeline event descriptions after successful fetch', async () => {
    render(<AdminShipmentsPage />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('SHP001'));
    });

    await waitFor(() => {
      expect(screen.getByText('Shipment created by merchant')).toBeInTheDocument();
      expect(screen.getByText('Delivered successfully')).toBeInTheDocument();
    });
  });

  it('shows no-history empty state on 404 and does not show an error retry button', async () => {
    const notFoundError: any = new Error('no events found for shipment');
    notFoundError.status = 404;
    (getShipmentTimeline as any).mockRejectedValue(notFoundError);

    render(<AdminShipmentsPage />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('SHP001'));
    });

    await waitFor(() => {
      expect(screen.getByText(/no history found/i)).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
    });
  });

  it('does not call getShipmentTimeline for a non-numeric shipment id', async () => {
    (getShipments as any).mockResolvedValue({
      shipments: [mockShipmentNonNumeric],
      total: 1,
      page: 1,
      page_size: 15,
    });

    render(<AdminShipmentsPage />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('SHP003'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
    });

    expect(getShipmentTimeline).not.toHaveBeenCalled();
    expect(screen.getByText(/no history available/i)).toBeInTheDocument();
  });

  it('shows error message and retry button on network failure, retry re-fetches', async () => {
    const networkError: any = new Error('network failure');
    networkError.status = 500;
    (getShipmentTimeline as any).mockRejectedValue(networkError);

    render(<AdminShipmentsPage />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('SHP001'));
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });

    // Restore success and click Retry
    (getShipmentTimeline as any).mockResolvedValue(mockTimeline);
    fireEvent.click(screen.getByRole('button', { name: /retry/i }));

    await waitFor(() => {
      expect(getShipmentTimeline).toHaveBeenCalledTimes(2);
      expect(screen.getByText('Shipment created by merchant')).toBeInTheDocument();
    });
  });
});
