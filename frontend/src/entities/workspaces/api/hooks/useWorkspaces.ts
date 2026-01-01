/**
 * @file: useWorkspaces.ts
 * @description: Хук для получения списка workspaces
 * @dependencies: @tanstack/react-query, queries, queryKeys
 * @created: 2025-01-XX
 */

import { useQuery } from '@tanstack/react-query';
import { getWorkspaces } from '../queries/getWorkspaces';
import { workspacesKeys } from '../queryKeys';

/**
 * Хук для получения списка workspaces
 * @returns объект с данными, состоянием загрузки и ошибками
 */
export const useWorkspaces = () => {
  return useQuery({
    queryKey: workspacesKeys.list.queryKey,
    queryFn: getWorkspaces,
  });
};

