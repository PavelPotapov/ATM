/**
 * @file: useCreateEstimateColumn.ts
 * @description: Хук для создания столбца сметы
 * @dependencies: @tanstack/react-query, queries, queryKeys
 * @created: 2025-01-04
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEstimateColumn } from '../queries/createEstimateColumn';
import { estimatesKeys } from '../queryKeys';
import type { CreateEstimateColumnDto } from '../dto/create-estimate-column.dto';
import type { EstimateColumnDto } from '../dto/estimate.dto';

/**
 * Хук для создания столбца сметы
 * @returns объект с функцией создания и состоянием
 */
export const useCreateEstimateColumn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEstimateColumnDto): Promise<EstimateColumnDto> => {
      return createEstimateColumn(data);
    },
    onSuccess: (data) => {
      // Инвалидируем кеш сметы (чтобы обновилась информация со столбцами)
      queryClient.invalidateQueries({
        queryKey: estimatesKeys.detail(data.estimateId).queryKey,
      });
      // Инвалидируем кеш столбцов
      queryClient.invalidateQueries({
        queryKey: estimatesKeys.columns(data.estimateId).queryKey,
      });
    },
  });
};

