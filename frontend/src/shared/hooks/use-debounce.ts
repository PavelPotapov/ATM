/**
 * @file: use-debounce.ts
 * @description: Хук для debounce значений
 * @created: 2025-01-04
 */

import { useEffect, useState } from 'react';

/**
 * Хук для debounce значений
 * @param value - значение для debounce
 * @param delay - задержка в миллисекундах (по умолчанию 500)
 * @returns debounced значение
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

