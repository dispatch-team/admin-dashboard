import { render, screen, fireEvent, waitFor, mockRouter } from '@test/utils';
import AdminLoginPage from '@/app/page';
import { useAuth } from '@/context/AuthContext';
import { login as keycloakLogin } from '@/lib/auth';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { toast } from 'sonner';

vi.mock('@/context/AuthContext', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/context/AuthContext')>();
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

vi.mock('@/lib/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/auth')>();
  return {
    ...actual,
    login: vi.fn(),
  };
});

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('next-themes', () => ({
  useTheme: () => ({
    resolvedTheme: 'light',
    setTheme: vi.fn(),
  }),
  ThemeProvider: ({ children }: any) => <>{children}</>,
}));

// Mock sessionStorage
const sessionStore: Record<string, string> = {};
const sessionStorageMock = {
  getItem: vi.fn((key: string) => sessionStore[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    sessionStore[key] = value.toString();
  }),
  removeItem: vi.fn((key: string) => {
    delete sessionStore[key];
  }),
  clear: vi.fn(() => {
    Object.keys(sessionStore).forEach(key => delete sessionStore[key]);
  }),
};

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

describe('AdminLoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    (useAuth as any).mockReturnValue({
      setTokens: vi.fn(),
      isAuthenticated: false,
    });
  });

  it('renders login form', () => {
    render(<AdminLoginPage />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('redirects if already authenticated', async () => {
    (useAuth as any).mockReturnValue({
      setTokens: vi.fn(),
      isAuthenticated: true,
    });

    render(<AdminLoginPage />);

    await waitFor(() => {
      expect(mockRouter.replace).toHaveBeenCalledWith('/admin');
    });
  });

  it('shows validation errors for empty fields', async () => {
    render(<AdminLoginPage />);
    
    // Ensure form is not disabled
    const usernameInput = screen.getByLabelText(/username/i);
    expect(usernameInput).not.toBeDisabled();

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    const form = signInButton.closest('form');
    if (form) {
      fireEvent.submit(form);
    } else {
      fireEvent.click(signInButton);
    }

    expect(await screen.findByText(/Username is required/)).toBeInTheDocument();
    expect(screen.getByText(/Password is required/)).toBeInTheDocument();
  });

  it('shows validation error for short password', async () => {
    render(<AdminLoginPage />);
    
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/Password must be at least 8 characters/)).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const setTokens = vi.fn();
    (useAuth as any).mockReturnValue({
      setTokens,
      isAuthenticated: false,
    });
    (keycloakLogin as any).mockResolvedValue({ accessToken: 'test-token' });

    render(<AdminLoginPage />);
    
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(keycloakLogin).toHaveBeenCalledWith('admin', 'password123', 'admin');
    });
    expect(setTokens).toHaveBeenCalledWith({ accessToken: 'test-token' });
    expect(toast.success).toHaveBeenCalled();
    
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/admin');
    }, { timeout: 2000 });
  });

  it('handles login failure', async () => {
    (keycloakLogin as any).mockRejectedValue({ message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' });

    render(<AdminLoginPage />);
    
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong-password' } });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });

  it('handles lockout after multiple failed attempts', async () => {
    (keycloakLogin as any).mockRejectedValue({ message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' });

    render(<AdminLoginPage />);
    
    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    // 5 failed attempts
    for (let i = 0; i < 5; i++) {
      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'wrong' } });
      fireEvent.click(signInButton);
      await screen.findByText(/invalid credentials/i);
    }

    expect(await screen.findByText(/too many failed attempts/i)).toBeInTheDocument();
    expect(usernameInput).toBeDisabled();
    expect(passwordInput).toBeDisabled();
    expect(signInButton).toBeDisabled();
  });

  it('toggles password visibility', () => {
    render(<AdminLoginPage />);
    
    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Find the toggle button - it's the one with the eye icon inside the password container
    const passwordContainer = passwordInput.parentElement;
    const toggleButton = passwordContainer?.querySelector('button');
    
    if (toggleButton) {
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'text');
      fireEvent.click(toggleButton);
      expect(passwordInput).toHaveAttribute('type', 'password');
    } else {
      throw new Error('Toggle button not found');
    }
  });
});
