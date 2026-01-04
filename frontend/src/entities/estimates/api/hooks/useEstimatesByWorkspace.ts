/**
 * @file: useEstimatesByWorkspace.ts
 * @description: Хук для получения списка смет проекта
 * @dependencies: @tanstack/react-query, queries, queryKeys
 * @created: 2025-01-04
 */

import { useQuery } from '@tanstack/react-query';
import { getEstimatesByWorkspace } from '../queries/getEstimatesByWorkspace';
import { estimatesKeys } from '../queryKeys';

/**
 * Хук для получения списка смет проекта
 * @param workspaceId - ID проекта
 * @returns объект с данными, состоянием загрузки и ошибками
 */
export const useEstimatesByWorkspace = (workspaceId: string) => {
  return useQuery({
    queryKey: estimatesKeys.byWorkspace(workspaceId).queryKey,
    queryFn: () => getEstimatesByWorkspace(workspaceId),
    enabled: !!workspaceId, // Запрос выполняется только если workspaceId указан
  });
};

