/**
 * @file: getPermissions.ts
 * @description: Запрос для получения списка разрешений пользователя
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-XX
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';
import type { Permission } from '../../types/permissions.types';

/**
 * Ответ API с разрешениями
 */
export interface PermissionsResponse {
  permissions: Permission[];
}

/**
 * Получить список разрешений текущего пользователя
 * @returns список разрешений
 */
export const getPermissions = async (): Promise<Permission[]> => {
  const response = await apiClient.get<PermissionsResponse>(
    API_ENDPOINTS.AUTH.PERMISSIONS,
  );
  return response.data.permissions;
};
