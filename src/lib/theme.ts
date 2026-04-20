/**
 * lib/theme.ts
 *
 * Theme configuration for Dispatch.
 */

export type ThemeMode = "dark" | "light" | "system";

/** localStorage keys used by ThemeConfigProvider. */
export const THEME_STORAGE_KEYS = {
  mode: "dispatch_theme_mode",
} as const;

/** The theme mode applied when no preference is stored. */
export const DEFAULT_THEME_MODE: ThemeMode = "dark";
