/**
 * @file: use-media-query.ts
 * @description: Хук для работы с media queries
 * @created: 2025-01-04
 */

import { useEffect, useState } from 'react';

/**
 * Хук для работы с media queries
 * @param query - media query строка (например, '(min-width: 768px)')
 * @returns true если media query совпадает
 */
export function useMediaQuery(query: string): boolean {
  const [value, setValue] = useState(false);

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    if (typeof window === 'undefined') return;

    const result = matchMedia(query);
    result.addEventListener('change', onChange);
    setValue(result.matches);

    return () => {
      result.removeEventListener('change', onChange);
    };
  }, [query]);

  return value;
}

