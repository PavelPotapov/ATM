/**
 * @file: queryKeys.ts
 * @description: Query keys для workspaces (типизированные ключи для TanStack Query)
 * @dependencies: @lukemorales/query-key-factory
 * @created: 2025-01-XX
 */

import { createQueryKeys } from '@lukemorales/query-key-factory';

/**
 * Query keys для workspaces
 * 
 * list: null - означает простой query key без параметров
 *   Результат: ['workspaces', 'list']
 *   Используется для списка без фильтров/пагинации
 *   TODO: В будущем добавить пагинацию: list: (params: PaginationParams) => [{ ...params }]
 * 
 * detail: (id: string) => [id] - означает query key с параметрами
 *   Результат: ['workspaces', 'detail', id]
 *   Используется для конкретного workspace по ID
 */
export const workspacesKeys = createQueryKeys('workspaces', {
  list: null, // TODO: Добавить пагинацию - list: (params: { page?: number; limit?: number }) => [{ ...params }]
  detail: (id: string) => [id],
});

