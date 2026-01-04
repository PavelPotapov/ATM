/**
 * @file: createColumnPermission.ts
 * @description: Запрос для создания разрешения на столбец
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-04
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';
import type { CreateColumnPermissionDto } from '../dto/column-permission.dto';
import type { ColumnRolePermissionDto } from '../dto/column-permission.dto';

/**
 * Создать разрешение на столбец для роли
 * @param data - данные для создания разрешения
 * @returns созданное разрешение
 */
export const createColumnPermission = async (
  data: CreateColumnPermissionDto,
): Promise<ColumnRolePermissionDto> => {
  const response = await apiClient.post<ColumnRolePermissionDto>(
    API_ENDPOINTS.ESTIMATES.CREATE_COLUMN_PERMISSION(data.columnId),
    data,
  );
  return response.data;
};

