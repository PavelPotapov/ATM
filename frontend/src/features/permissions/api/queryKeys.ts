/**
 * @file: queryKeys.ts
 * @description: Query keys для permissions (типизированные ключи для TanStack Query)
 * @dependencies: @lukemorales/query-key-factory
 * @created: 2025-01-XX
 */

import { createQueryKeys } from '@lukemorales/query-key-factory';

export const permissionsKeys = createQueryKeys('permissions', {
  list: null,
});
