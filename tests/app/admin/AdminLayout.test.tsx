import { render, screen, fireEvent, waitFor } from '@test/utils';
import AdminLayout from '@/app/admin/layout';
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

vi.mock('next-themes', () => ({
  useTheme: () => ({
    resolvedTheme: 'light',
    setTheme: vi.fn(),
  }),
  ThemeProvider: ({ children }: any) => <>{children}</>,
}));

describe('AdminLayout', () => {
  const mockLogout = vi.fn();
  const mockGetValidAccessToken = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      logout: mockLogout,
      getValidAccessToken: mockGetValidAccessToken,
      isAuthenticated: true,
      user: { name: 'Admin User', email: 'admin@example.com', roles: ['admin'] },
    });
    mockGetValidAccessToken.mockResolvedValue('test-token');
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ first_name: 'John', last_name: 'Doe', email: 'john@example.com' }),
    });
  });

  it('renders sidebar with navigation items', async () => {
    render(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>
    );

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Merchants/i)).toBeInTheDocument();
    expect(screen.getByText(/Couriers/i)).toBeInTheDocument();
    expect(screen.getByText(/Shipments/i)).toBeInTheDocument();
  });

  it('shows profile information', async () => {
    render(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>
    );

    await waitFor(() => {
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
    });
  });

  it('toggles sidebar collapse', async () => {
    render(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>
    );

    const toggleButton = screen.getByRole('button', { name: '' }); // The chevron button
    fireEvent.click(toggleButton);

    // When collapsed, labels should be hidden (check framer-motion AnimatePresence/motion behavior in tests might be tricky but we can check the state)
    // Actually labels are hidden by `!isCollapsed && ...`
    expect(screen.queryByText(/Dashboard/i)).not.toBeInTheDocument();
  });

  it('calls logout on button click', async () => {
    render(
      <AdminLayout>
        <div>Test Content</div>
      </AdminLayout>
    );

    const logoutButton = screen.getByText(/Log Out/i);
    fireEvent.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });
});
