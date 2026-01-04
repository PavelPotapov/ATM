/**
 * @file: useEstimate.ts
 * @description: Хук для получения сметы по ID
 * @dependencies: @tanstack/react-query, queries, queryKeys
 * @created: 2025-01-04
 */

import { useQuery } from '@tanstack/react-query';
import { getEstimateById } from '../queries/getEstimateById';
import { estimatesKeys } from '../queryKeys';

/**
 * Хук для получения сметы по ID
 * @param id - ID сметы
 * @param full - получить полную информацию (со столбцами и количеством строк)
 * @returns объект с данными, состоянием загрузки и ошибками
 */
export const useEstimate = (id: string, full?: boolean) => {
  return useQuery({
    queryKey: estimatesKeys.detail(id).queryKey,
    queryFn: () => getEstimateById(id, full),
    enabled: !!id, // Запрос выполняется только если id указан
  });
};

