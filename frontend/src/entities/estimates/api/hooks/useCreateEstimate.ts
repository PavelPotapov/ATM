/**
 * @file: useCreateEstimate.ts
 * @description: Хук для создания сметы
 * @dependencies: @tanstack/react-query, queries, queryKeys
 * @created: 2025-01-04
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEstimate } from '../queries/createEstimate';
import { estimatesKeys } from '../queryKeys';
import type { CreateEstimateDto } from '../dto/create-estimate.dto';
import type { EstimateDto } from '../dto/estimate.dto';

/**
 * Хук для создания сметы
 * @returns объект с функцией создания и состоянием
 */
export const useCreateEstimate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEstimateDto): Promise<EstimateDto> => {
      return createEstimate(data);
    },
    onSuccess: (data) => {
      // Инвалидируем кеш списка смет проекта после создания
      queryClient.invalidateQueries({
        queryKey: estimatesKeys.byWorkspace(data.workspaceId).queryKey,
      });
      // Также инвалидируем общий список смет
      queryClient.invalidateQueries({ queryKey: estimatesKeys.list.queryKey });
    },
  });
};

