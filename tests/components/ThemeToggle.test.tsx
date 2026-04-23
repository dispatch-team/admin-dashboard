import { render, screen, fireEvent } from '@test/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from 'next-themes';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('next-themes', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next-themes')>();
  return {
    ...actual,
    useTheme: vi.fn(),
  };
});

describe('ThemeToggle', () => {
  const setThemeMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useTheme as any).mockReturnValue({
      theme: 'light',
      setTheme: setThemeMock,
    });
  });

  it('renders the trigger button after mounting', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('opens the menu and shows theme options', () => {
    render(<ThemeToggle />);
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    expect(screen.getByText('Light mode')).toBeInTheDocument();
    expect(screen.getByText('Dark mode')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });

  it('calls setTheme when a theme option is clicked', () => {
    render(<ThemeToggle />);
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    const darkModeOption = screen.getByText('Dark mode');
    fireEvent.click(darkModeOption);

    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });

  it('renders the correct icon for light theme', () => {
    (useTheme as any).mockReturnValue({
      theme: 'light',
      setTheme: setThemeMock,
    });
    const { container } = render(<ThemeToggle />);
    expect(container.querySelector('.lucide-sun')).toBeInTheDocument();
  });

  it('renders the correct icon for dark theme', () => {
    (useTheme as any).mockReturnValue({
      theme: 'dark',
      setTheme: setThemeMock,
    });
    const { container } = render(<ThemeToggle />);
    expect(container.querySelector('.lucide-moon')).toBeInTheDocument();
  });
});
