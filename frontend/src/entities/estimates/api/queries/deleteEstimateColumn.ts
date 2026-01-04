/**
 * @file: deleteEstimateColumn.ts
 * @description: Запрос для удаления столбца сметы
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-04
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';

/**
 * Удалить столбец сметы
 * @param columnId - ID столбца
 */
export const deleteEstimateColumn = async (columnId: string): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.ESTIMATES.DELETE_COLUMN(columnId));
};

