/**
 * @file: useWorkspace.ts
 * @description: Хук для получения workspace по ID
 * @dependencies: @tanstack/react-query, queries, queryKeys
 * @created: 2025-01-XX
 */

import { useQuery } from '@tanstack/react-query';
import { getWorkspaceById } from '../queries/getWorkspaceById';
import { workspacesKeys } from '../queryKeys';

/**
 * Хук для получения workspace по ID
 * @param id - ID workspace
 * @returns объект с данными, состоянием загрузки и ошибками
 */
export const useWorkspace = (id: string) => {
  return useQuery({
    queryKey: workspacesKeys.detail(id).queryKey,
    queryFn: () => getWorkspaceById(id),
    enabled: !!id,
  });
};

