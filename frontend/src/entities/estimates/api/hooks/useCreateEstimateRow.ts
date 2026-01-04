/**
 * @file: useCreateEstimateRow.ts
 * @description: Хук для создания строки сметы
 * @dependencies: @tanstack/react-query, queries, queryKeys
 * @created: 2025-01-04
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEstimateRow } from '../queries/createEstimateRow';
import { estimatesKeys } from '../queryKeys';
import type { CreateEstimateRowDto, EstimateTableRowDto } from '../dto/estimate-table.dto';

/**
 * Хук для создания строки сметы
 * @returns объект с функцией создания и состоянием
 */
export const useCreateEstimateRow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      estimateId,
      data,
    }: {
      estimateId: string;
      data?: Omit<CreateEstimateRowDto, 'estimateId'>;
    }): Promise<EstimateTableRowDto> => {
      return createEstimateRow(estimateId, data);
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

