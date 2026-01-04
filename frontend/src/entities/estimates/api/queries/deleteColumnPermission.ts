/**
 * @file: deleteColumnPermission.ts
 * @description: Запрос для удаления разрешения на столбец
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-04
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';

/**
 * Удалить разрешение на столбец
 * @param permissionId - ID разрешения
 */
export const deleteColumnPermission = async (permissionId: string): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.ESTIMATES.DELETE_COLUMN_PERMISSION(permissionId));
};

