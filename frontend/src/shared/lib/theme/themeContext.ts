/**
 * @file: themeContext.ts
 * @description: Контекст для управления темой (вынесен отдельно для совместимости с Fast Refresh)
 * @created: 2025-01-XX
 */

import { createContext } from 'react';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const THEME_STORAGE_KEY = 'theme';

