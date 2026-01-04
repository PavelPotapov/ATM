/**
 * @file: use-hot-key.ts
 * @description: Хук для обработки горячих клавиш
 * @created: 2025-01-04
 */

import { useEffect } from 'react';

/**
 * Хук для обработки горячих клавиш (Cmd/Ctrl + Key)
 * @param callback - функция, которая вызывается при нажатии
 * @param key - клавиша (например, 'k', 'b')
 */
export function useHotKey(callback: () => void, key: string): void {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === key && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        callback();
      }
    }

    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [callback, key]);
}

