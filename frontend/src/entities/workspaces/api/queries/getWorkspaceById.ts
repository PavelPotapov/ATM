/**
 * @file: getWorkspaceById.ts
 * @description: Запрос для получения workspace по ID
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-XX
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';
import type { WorkspaceDto } from '../dto/workspace.dto';

/**
 * Получить workspace по ID
 * @param id - ID workspace
 * @returns workspace
 */
export const getWorkspaceById = async (id: string): Promise<WorkspaceDto> => {
  const response = await apiClient.get<WorkspaceDto>(API_ENDPOINTS.WORKSPACES.BY_ID(id));
  return response.data;
};

