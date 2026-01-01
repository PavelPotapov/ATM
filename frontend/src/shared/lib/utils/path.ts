/**
 * @file: path.ts
 * @description: Утилиты для работы с путями
 * @created: 2025-01-XX
 */

/**
 * Нормализует путь, убирая trailing slash (кроме корневого пути)
 * Это позволяет /login и /login/ считаться одинаковыми
 */
export function normalizePath(path: string): string {
  // Корневой путь оставляем как есть
  if (path === '/') {
    return '/';
  }
  // Убираем trailing slash для всех остальных путей
  return path.endsWith('/') ? path.slice(0, -1) : path;
}

/**
 * Декоратор для нормализации путей в объекте конфигурации
 */
export function normalizeRoutes<T extends Record<string, string>>(routes: T): T {
  const normalized = {} as T;
  for (const key in routes) {
    normalized[key] = normalizePath(routes[key]) as T[typeof key];
  }
  return normalized;
}

