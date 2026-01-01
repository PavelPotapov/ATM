/**
 * @file: themeUtils.ts
 * @description: Утилиты для работы с темой
 * @created: 2025-01-XX
 */

import type { Theme } from './themeContext';

/**
 * Получает сохраненную тему из localStorage
 */
export function getStoredTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'system';
  }
  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
}

/**
 * Получает системную тему
 */
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/**
 * Применяет тему к документу
 */
export function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') {
    return;
  }
  const root = document.documentElement;
  const resolved = theme === 'system' ? getSystemTheme() : theme;

  if (resolved === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

