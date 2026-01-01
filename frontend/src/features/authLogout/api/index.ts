/**
 * @file: index.ts
 * @description: Публичный API модуля authLogout
 * @created: 2025-01-XX
 */

// Экспорт queries (опционально, если нужны напрямую)
export { logout } from './queries/logout';

// Экспорт hooks (основной способ использования)
export { useLogout } from './hooks/useLogout';

