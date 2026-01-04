/**
 * @file: useUpdateEstimateColumn.ts
 * @description: Хук для обновления столбца сметы
 * @dependencies: @tanstack/react-query, queries, queryKeys
 * @created: 2025-01-04
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateEstimateColumn } from '../queries/updateEstimateColumn';
import { estimatesKeys } from '../queryKeys';
import type { UpdateEstimateColumnDto } from '../dto/update-estimate-column.dto';
import type { EstimateColumnDto } from '../dto/estimate.dto';

/**
 * Хук для обновления столбца сметы
 * @returns объект с функцией обновления и состоянием
 */
export const useUpdateEstimateColumn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      columnId,
      data,
    }: {
      columnId: string;
      data: UpdateEstimateColumnDto;
    }): Promise<EstimateColumnDto> => {
      return updateEstimateColumn(columnId, data);
    },
    onSuccess: (data, variables) => {
      // Инвалидируем кеш полной информации о столбце (используем columnId из variables)
      queryClient.invalidateQueries({
        queryKey: [...estimatesKeys.column(variables.columnId).queryKey, 'full'],
      });
      // Инвалидируем кеш истории изменений столбца
      queryClient.invalidateQueries({
        queryKey: [...estimatesKeys.column(variables.columnId).queryKey, 'history'],
      });
      // Инвалидируем кеш сметы (используем estimateId из ответа)
      queryClient.invalidateQueries({
        queryKey: estimatesKeys.detail(data.estimateId).queryKey,
      });
    },
  });
};

