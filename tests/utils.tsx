import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { IntlProvider } from '@/intl';
import { ThemeConfigProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/context/AuthContext';
import { vi } from 'vitest';

// Mock next/navigation
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
};

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeConfigProvider>
      <IntlProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </IntlProvider>
    </ThemeConfigProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
