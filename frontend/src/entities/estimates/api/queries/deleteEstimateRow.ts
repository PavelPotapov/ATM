/**
 * @file: deleteEstimateRow.ts
 * @description: Запрос для удаления строки сметы
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-04
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';

/**
 * Удалить строку сметы
 * @param rowId - ID строки
 */
export const deleteEstimateRow = async (rowId: string): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.ESTIMATES.DELETE_ROW(rowId));
};

