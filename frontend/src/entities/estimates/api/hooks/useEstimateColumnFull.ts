/**
 * @file: useEstimateColumnFull.ts
 * @description: Хук для получения полной информации о столбце
 * @dependencies: @tanstack/react-query, queries, queryKeys
 * @created: 2025-01-04
 */

import { useQuery } from '@tanstack/react-query';
import { getEstimateColumnFull } from '../queries/getEstimateColumnFull';
import { estimatesKeys } from '../queryKeys';

/**
 * Хук для получения полной информации о столбце
 * @param columnId - ID столбца
 * @returns объект с данными, состоянием загрузки и ошибками
 */
export const useEstimateColumnFull = (columnId: string) => {
  return useQuery({
    queryKey: [...estimatesKeys.column(columnId).queryKey, 'full'],
    queryFn: () => getEstimateColumnFull(columnId),
    enabled: !!columnId, // Запрос выполняется только если columnId указан
  });
};

