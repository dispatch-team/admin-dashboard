import { render, screen, fireEvent, waitFor, mockRouter } from '@test/utils';
import CreateCourierPage from '@/app/admin/couriers/create/page';
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

describe('CreateCourierPage', () => {
  const mockGetValidAccessToken = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      getValidAccessToken: mockGetValidAccessToken,
    });
    mockGetValidAccessToken.mockResolvedValue('test-token');
  });

  it('renders create courier form', () => {
    render(<CreateCourierPage />);
    expect(screen.getByText(/Create Courier Company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    render(<CreateCourierPage />);
    
    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getAllByText(/Must be at least/i).length).toBeGreaterThan(0);
    });
  });

  it('completes the multi-step form and submits', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1 }),
    });

    render(<CreateCourierPage />);

    // Step 1: Business Details
    fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: 'FastTrack' } });
    fireEvent.change(screen.getByLabelText(/Company Address/i), { target: { value: 'Bole Road, Addis Ababa' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '0911223344' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'fast@track.com' } });
    
    // Owner Account
    fireEvent.change(screen.getByLabelText(/Owner First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Owner Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Owner Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });

    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    // Step 2: Review
    await waitFor(() => {
      expect(screen.getByText(/Review Details/i)).toBeInTheDocument();
      expect(screen.getByText('FastTrack')).toBeInTheDocument();
      expect(screen.getByText('fast@track.com')).toBeInTheDocument();
    });

    const registerButton = screen.getByRole('button', { name: /Confirm & Register/i });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/admin/couriers', expect.objectContaining({
        method: 'POST',
        body: expect.stringContaining('"company_name":"FastTrack"'),
      }));
    });

    expect(toast.success).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledWith('/admin/couriers');
  });

  it('allows going back to edit from review step', async () => {
    render(<CreateCourierPage />);

    fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: 'FastTrack' } });
    fireEvent.change(screen.getByLabelText(/Company Address/i), { target: { value: 'Bole Road' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '0911223344' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'fast@track.com' } });
    fireEvent.change(screen.getByLabelText(/Owner First Name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/Owner Last Name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/Owner Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    await waitFor(() => {
      expect(screen.getByText(/Review Details/i)).toBeInTheDocument();
    });

    const backButton = screen.getByRole('button', { name: /Back to Edit/i });
    fireEvent.click(backButton);

    expect(screen.getByText(/Create Courier Company/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('FastTrack')).toBeInTheDocument();
  });
});
