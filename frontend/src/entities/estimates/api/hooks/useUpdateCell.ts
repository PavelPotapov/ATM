/**
 * @file: useUpdateCell.ts
 * @description: Хук для обновления ячейки
 * @dependencies: @tanstack/react-query, queries, queryKeys
 * @created: 2025-01-04
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCell } from '../queries/updateCell';
import { estimatesKeys } from '../queryKeys';
import type { UpdateCellDto, EstimateTableCellDto } from '../dto/estimate-table.dto';

/**
 * Хук для обновления ячейки
 * @returns объект с функцией обновления и состоянием
 */
export const useUpdateCell = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cellId,
      estimateId,
      data,
    }: {
      cellId: string;
      estimateId: string;
      data: UpdateCellDto;
    }): Promise<EstimateTableCellDto> => {
      return updateCell(cellId, data);
    },
    onSuccess: (_, { estimateId }) => {
      // Инвалидируем кеш таблицы
      queryClient.invalidateQueries({
        queryKey: estimatesKeys.table(estimateId).queryKey,
      });
    },
  });
};

