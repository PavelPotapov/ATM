/**
 * @file: useDeleteEstimate.ts
 * @description: Хук для удаления сметы
 * @dependencies: @tanstack/react-query, queries, queryKeys
 * @created: 2025-01-04
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEstimate } from '../queries/deleteEstimate';
import { estimatesKeys } from '../queryKeys';

/**
 * Хук для удаления сметы
 * @returns объект с функцией удаления и состоянием
 */
export const useDeleteEstimate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string): Promise<void> => {
      return deleteEstimate(id);
    },
    onSuccess: (_, id) => {
      // Инвалидируем кеш конкретной сметы
      queryClient.invalidateQueries({
        queryKey: estimatesKeys.detail(id).queryKey,
      });
      // Инвалидируем кеш списка смет (нужно будет получить workspaceId из кеша)
      queryClient.invalidateQueries({ queryKey: estimatesKeys.list.queryKey });
      // Инвалидируем все списки по workspace (так как мы не знаем workspaceId)
      queryClient.invalidateQueries({
        predicate: (query) => {
          return (
            query.queryKey[0] === 'estimates' &&
            query.queryKey[1] === 'byWorkspace'
          );
        },
      });
    },
  });
};

