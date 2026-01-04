/**
 * @file: use-local-storage.ts
 * @description: Хук для работы с localStorage
 * @created: 2025-01-04
 */

import { useEffect, useState, useCallback } from 'react';

function getItemFromLocalStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  const item = window.localStorage.getItem(key);
  if (item) {
    try {
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Хук для работы с localStorage
 * @param key - ключ в localStorage
 * @param initialValue - начальное значение
 * @returns кортеж [значение, функция установки]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = getItemFromLocalStorage<T>(key);
      if (stored !== null) {
        setStoredValue(stored);
      }
    }
  }, [key]);

  const setValue: React.Dispatch<React.SetStateAction<T>> = useCallback(
    (value) => {
      if (value instanceof Function) {
        setStoredValue((prev: T) => {
          const newValue = value(prev);
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(key, JSON.stringify(newValue));
          }
          return newValue;
        });
      } else {
        setStoredValue(value);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(value));
        }
      }
    },
    [key],
  );

  return [storedValue, setValue];
}

