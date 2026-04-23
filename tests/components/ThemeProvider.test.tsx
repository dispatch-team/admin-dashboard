import { render, screen, act } from '@testing-library/react';
import { ThemeConfigProvider, useThemeConfig } from '@/components/ThemeProvider';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';

// Mock next-themes as it uses client-only features
vi.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const TestComponent = () => {
  const { mode, setMode } = useThemeConfig();
  return (
    <div>
      <span data-testid="mode">{mode}</span>
      <button onClick={() => setMode('light')}>Change to Light</button>
    </div>
  );
};

describe('ThemeConfigProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('provides default theme mode', () => {
    render(
      <ThemeConfigProvider>
        <TestComponent />
      </ThemeConfigProvider>
    );

    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
  });

  it('hydrates from localStorage', () => {
    localStorage.setItem('dispatch_theme_mode', 'light');
    render(
      <ThemeConfigProvider>
        <TestComponent />
      </ThemeConfigProvider>
    );

    expect(screen.getByTestId('mode')).toHaveTextContent('light');
  });

  it('changes mode and updates localStorage', () => {
    render(
      <ThemeConfigProvider>
        <TestComponent />
      </ThemeConfigProvider>
    );

    const button = screen.getByText('Change to Light');
    act(() => {
      button.click();
    });

    expect(screen.getByTestId('mode')).toHaveTextContent('light');
    expect(localStorage.getItem('dispatch_theme_mode')).toBe('light');
  });
});
