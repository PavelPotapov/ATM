/**
 * @file: themeProvider.tsx
 * @description: Провайдер для управления темой приложения
 * @created: 2025-01-XX
 */

import { useEffect, useState, useMemo } from 'react';
import { ThemeContext, type Theme } from './themeContext';
import { getStoredTheme, getSystemTheme, applyTheme } from './themeUtils';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme());

  // Вычисляем resolvedTheme через useMemo
  const resolvedTheme = useMemo<'light' | 'dark'>(() => {
    return theme === 'system' ? getSystemTheme() : theme;
  }, [theme]);

  // Применяем тему при монтировании и изменении
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Слушаем изменения системной темы
  useEffect(() => {
    if (theme !== 'system') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      applyTheme('system');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
    applyTheme(newTheme);
  };

  const value = useMemo(
    () => ({ theme, setTheme, resolvedTheme }),
    [theme, resolvedTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
