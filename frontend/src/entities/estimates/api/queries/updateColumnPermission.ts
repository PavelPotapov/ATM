/**
 * @file: updateColumnPermission.ts
 * @description: Запрос для обновления разрешения на столбец
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-04
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';
import type { UpdateColumnPermissionDto } from '../dto/column-permission.dto';
import type { ColumnRolePermissionDto } from '../dto/column-permission.dto';

/**
 * Обновить разрешение на столбец
 * @param permissionId - ID разрешения
 * @param data - данные для обновления
 * @returns обновленное разрешение
 */
export const updateColumnPermission = async (
  permissionId: string,
  data: UpdateColumnPermissionDto,
): Promise<ColumnRolePermissionDto> => {
  const response = await apiClient.patch<ColumnRolePermissionDto>(
    API_ENDPOINTS.ESTIMATES.UPDATE_COLUMN_PERMISSION(permissionId),
    data,
  );
  return response.data;
};

