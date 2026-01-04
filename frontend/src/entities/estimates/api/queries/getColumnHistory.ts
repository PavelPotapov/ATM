/**
 * @file: getColumnHistory.ts
 * @description: Запрос для получения истории изменений столбца
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-04
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';
import type { ColumnHistoryDto } from '../dto/column-history.dto';

/**
 * Получить историю изменений столбца
 * @param columnId - ID столбца
 * @returns список записей истории
 */
export const getColumnHistory = async (
  columnId: string,
): Promise<ColumnHistoryDto[]> => {
  const response = await apiClient.get<ColumnHistoryDto[]>(
    API_ENDPOINTS.ESTIMATES.GET_COLUMN_HISTORY(columnId),
  );
  return response.data;
};

