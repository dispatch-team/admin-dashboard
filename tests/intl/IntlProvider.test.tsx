import { render, screen, act } from '@testing-library/react';
import { IntlProvider, useLocale, useI18n } from '@/intl/IntlProvider';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';

const TestComponent = () => {
  const { locale, setLocale } = useLocale();
  const t = useI18n('common');
  return (
    <div>
      <span data-testid="locale">{locale}</span>
      <span data-testid="translation">{t('language')}</span>
      <button onClick={() => setLocale('am')}>Change to Amharic</button>
    </div>
  );
};

const ReplacementComponent = () => {
  const t = useI18n('dashboards');
  return (
    <div data-testid="replacement">
      {t('admin.showingOfShipments', { count: 5, total: 10 })}
    </div>
  );
};

describe('IntlProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('provides default locale and translations', () => {
    render(
      <IntlProvider>
        <TestComponent />
      </IntlProvider>
    );

    expect(screen.getByTestId('locale')).toHaveTextContent('en');
    expect(screen.getByTestId('translation')).toHaveTextContent('Language');
  });

  it('hydrates from localStorage', () => {
    localStorage.setItem('dispatch_locale', 'am');
    render(
      <IntlProvider>
        <TestComponent />
      </IntlProvider>
    );

    expect(screen.getByTestId('locale')).toHaveTextContent('am');
    expect(screen.getByTestId('translation')).toHaveTextContent('ቋንቋ');
  });

  it('changes locale and updates localStorage', () => {
    render(
      <IntlProvider>
        <TestComponent />
      </IntlProvider>
    );

    const button = screen.getByText('Change to Amharic');
    act(() => {
      button.click();
    });

    expect(screen.getByTestId('locale')).toHaveTextContent('am');
    expect(localStorage.getItem('dispatch_locale')).toBe('am');
  });

  it('handles string replacements in translations', () => {
    render(
      <IntlProvider>
        <ReplacementComponent />
      </IntlProvider>
    );

    expect(screen.getByTestId('replacement')).toHaveTextContent('Showing 5 of 10 shipments');
  });

  it('returns key if translation is missing', () => {
    const MissingTranslation = () => {
      const t = useI18n('common');
      return <div data-testid="missing">{t('nonexistent.key' as any)}</div>;
    };

    render(
      <IntlProvider>
        <MissingTranslation />
      </IntlProvider>
    );

    expect(screen.getByTestId('missing')).toHaveTextContent('nonexistent.key');
  });
});
