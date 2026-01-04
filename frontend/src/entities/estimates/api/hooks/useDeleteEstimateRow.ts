/**
 * @file: useDeleteEstimateRow.ts
 * @description: Хук для удаления строки сметы
 * @dependencies: @tanstack/react-query, queries, queryKeys
 * @created: 2025-01-04
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEstimateRow } from '../queries/deleteEstimateRow';
import { estimatesKeys } from '../queryKeys';

/**
 * Хук для удаления строки сметы
 * @returns объект с функцией удаления и состоянием
 */
export const useDeleteEstimateRow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      rowId,
      estimateId,
    }: {
      rowId: string;
      estimateId: string;
    }): Promise<void> => {
      return deleteEstimateRow(rowId);
    },
    onSuccess: (_, { estimateId }) => {
      // Инвалидируем кеш таблицы
      queryClient.invalidateQueries({
        queryKey: estimatesKeys.table(estimateId).queryKey,
      });
      // Инвалидируем кеш сметы (чтобы обновилось количество строк)
      queryClient.invalidateQueries({
        queryKey: estimatesKeys.detail(estimateId).queryKey,
      });
    },
  });
};

