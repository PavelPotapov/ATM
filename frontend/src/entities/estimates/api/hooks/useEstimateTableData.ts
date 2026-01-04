/**
 * @file: useEstimateTableData.ts
 * @description: Хук для получения данных таблицы сметы
 * @dependencies: @tanstack/react-query, queries, queryKeys
 * @created: 2025-01-04
 */

import { useQuery } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import { getEstimateTableData } from '../queries/getEstimateTableData';
import { estimatesKeys } from '../queryKeys';

/**
 * Хук для получения данных таблицы сметы
 * @param estimateId - ID сметы
 * @returns объект с данными, состоянием загрузки и ошибками
 */
export const useEstimateTableData = (estimateId: string) => {
  return useQuery({
    queryKey: estimatesKeys.table(estimateId).queryKey,
    queryFn: () => getEstimateTableData(estimateId),
    enabled: !!estimateId,
    placeholderData: keepPreviousData, // Сохраняем предыдущие данные во время обновления
  });
};

