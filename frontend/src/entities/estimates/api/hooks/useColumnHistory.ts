/**
 * @file: useColumnHistory.ts
 * @description: Хук для получения истории изменений столбца
 * @dependencies: @tanstack/react-query, queries, queryKeys
 * @created: 2025-01-04
 */

import { useQuery } from '@tanstack/react-query';
import { getColumnHistory } from '../queries/getColumnHistory';
import { estimatesKeys } from '../queryKeys';

/**
 * Хук для получения истории изменений столбца
 * @param columnId - ID столбца
 * @returns объект с данными, состоянием загрузки и ошибками
 */
export const useColumnHistory = (columnId: string) => {
  return useQuery({
    queryKey: [...estimatesKeys.column(columnId).queryKey, 'history'],
    queryFn: () => getColumnHistory(columnId),
    enabled: !!columnId,
  });
};

