/**
 * @file: useUpdateEstimate.ts
 * @description: Хук для обновления сметы
 * @dependencies: @tanstack/react-query, queries, queryKeys
 * @created: 2025-01-04
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateEstimate } from '../queries/updateEstimate';
import { estimatesKeys } from '../queryKeys';
import type { UpdateEstimateDto } from '../dto/update-estimate.dto';
import type { EstimateDto } from '../dto/estimate.dto';

/**
 * Хук для обновления сметы
 * @returns объект с функцией обновления и состоянием
 */
export const useUpdateEstimate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateEstimateDto;
    }): Promise<EstimateDto> => {
      return updateEstimate(id, data);
    },
    onSuccess: (data) => {
      // Инвалидируем кеш конкретной сметы
      queryClient.invalidateQueries({
        queryKey: estimatesKeys.detail(data.id).queryKey,
      });
      // Инвалидируем кеш списка смет проекта
      queryClient.invalidateQueries({
        queryKey: estimatesKeys.byWorkspace(data.workspaceId).queryKey,
      });
    },
  });
};

