/**
 * @file: deleteEstimate.ts
 * @description: Запрос для удаления сметы
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-04
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';

/**
 * Удалить смету (мягкое удаление)
 * @param id - ID сметы
 */
export const deleteEstimate = async (id: string): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.ESTIMATES.DELETE(id));
};

