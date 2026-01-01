/**
 * @file: useTheme.ts
 * @description: Хук для работы с темой
 * @created: 2025-01-XX
 */

import { useContext } from 'react';
import { ThemeContext } from './themeContext';

/**
 * Хук для работы с темой
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
