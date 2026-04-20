"use client";

/**
 * components/ThemeProvider.tsx
 *
 * Wraps next-themes for mode management (dark/light).
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import {
  DEFAULT_THEME_MODE,
  THEME_STORAGE_KEYS,
  type ThemeMode,
} from "@/lib/theme";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ThemeConfigContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeConfigContext = createContext<ThemeConfigContextValue>({
  mode: DEFAULT_THEME_MODE,
  setMode: () => {},
});

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * ThemeConfigProvider
 * Must wrap the app.
 * Persists mode to localStorage.
 */
export function ThemeConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setModeState] = useState<ThemeMode>(DEFAULT_THEME_MODE);

  // Hydrate from localStorage
  useEffect(() => {
    const storedMode = localStorage.getItem(
      THEME_STORAGE_KEYS.mode
    ) as ThemeMode | null;
    if (storedMode) setModeState(storedMode);
  }, []);

  const setMode = useCallback((next: ThemeMode) => {
    localStorage.setItem(THEME_STORAGE_KEYS.mode, next);
    setModeState(next);
  }, []);

  return (
    <ThemeConfigContext.Provider
      value={{ mode, setMode }}
    >
      <NextThemesProvider
        attribute="class"
        defaultTheme={DEFAULT_THEME_MODE}
        enableSystem
        disableTransitionOnChange={false}
      >
        {children}
      </NextThemesProvider>
    </ThemeConfigContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useThemeConfig(): ThemeConfigContextValue {
  return useContext(ThemeConfigContext);
}
