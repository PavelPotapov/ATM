/**
 * @file: queryKeys.ts
 * @description: Query keys для estimates (типизированные ключи для TanStack Query)
 * @dependencies: @lukemorales/query-key-factory
 * @created: 2025-01-04
 */

import { createQueryKeys } from '@lukemorales/query-key-factory';

/**
 * Query keys для estimates
 */
export const estimatesKeys = createQueryKeys('estimates', {
  list: null,
  byWorkspace: (workspaceId: string) => [workspaceId],
  detail: (id: string) => [id],
  columns: (estimateId: string) => [estimateId, 'columns'],
  column: (columnId: string) => [columnId, 'column'],
  table: (estimateId: string) => [estimateId, 'table'],
});

