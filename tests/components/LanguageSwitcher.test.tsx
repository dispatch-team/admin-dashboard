import { render, screen, fireEvent } from '@test/utils';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLocale, useI18n } from '@/intl';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/intl', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/intl')>();
  return {
    ...actual,
    useLocale: vi.fn(),
    useI18n: vi.fn(),
  };
});

describe('LanguageSwitcher', () => {
  const setLocaleMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useLocale as any).mockReturnValue({
      locale: 'en',
      setLocale: setLocaleMock,
    });
    (useI18n as any).mockReturnValue((key: string) => key);
  });

  it('renders the trigger button', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('opens the menu and shows language options', async () => {
    render(<LanguageSwitcher />);
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('አማርኛ')).toBeInTheDocument();
  });

  it('calls setLocale when a language is clicked', async () => {
    render(<LanguageSwitcher />);
    const trigger = screen.getByRole('button');
    fireEvent.click(trigger);

    const amharicOption = screen.getByText('አማርኛ');
    fireEvent.click(amharicOption);

    expect(setLocaleMock).toHaveBeenCalledWith('am');
  });
});
