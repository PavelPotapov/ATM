/**
 * @file: getWorkspaces.ts
 * @description: Запрос для получения списка workspaces
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-XX
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';
import type { WorkspaceDto } from '../dto/workspace.dto';

/**
 * Получить список workspaces пользователя
 * @returns список workspaces
 */
export const getWorkspaces = async (): Promise<WorkspaceDto[]> => {
  const response = await apiClient.get<WorkspaceDto[]>(API_ENDPOINTS.WORKSPACES.LIST);
  return response.data;
};

