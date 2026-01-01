/**
 * @file: queryKeys.ts
 * @description: Query keys для аутентификации (типизированные ключи для TanStack Query)
 * @dependencies: @lukemorales/query-key-factory
 * @created: 2025-01-XX
 */

import { createQueryKeys } from '@lukemorales/query-key-factory';

export const authKeys = createQueryKeys('auth', {
  user: null, // Текущий пользователь
});

