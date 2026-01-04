/**
 * @file: useDeleteEstimateColumn.ts
 * @description: Хук для удаления столбца сметы
 * @dependencies: @tanstack/react-query, queries, queryKeys
 * @created: 2025-01-04
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEstimateColumn } from '../queries/deleteEstimateColumn';
import { estimatesKeys } from '../queryKeys';

/**
 * Хук для удаления столбца сметы
 * @returns объект с функцией удаления и состоянием
 */
export const useDeleteEstimateColumn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      columnId,
      estimateId,
    }: {
      columnId: string;
      estimateId: string;
    }): Promise<void> => {
      return deleteEstimateColumn(columnId);
    },
    onSuccess: (_, { estimateId }) => {
      // Инвалидируем кеш сметы
      queryClient.invalidateQueries({
        queryKey: estimatesKeys.detail(estimateId).queryKey,
      });
      // Инвалидируем кеш столбцов
      queryClient.invalidateQueries({
        queryKey: estimatesKeys.columns(estimateId).queryKey,
      });
    },
  });
};

