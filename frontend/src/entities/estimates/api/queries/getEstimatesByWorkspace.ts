/**
 * @file: getEstimatesByWorkspace.ts
 * @description: Запрос для получения списка смет проекта
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-04
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';
import type { EstimateDto } from '../dto/estimate.dto';

/**
 * Получить список смет проекта
 * @param workspaceId - ID проекта
 * @returns список смет
 */
export const getEstimatesByWorkspace = async (
  workspaceId: string,
): Promise<EstimateDto[]> => {
  const response = await apiClient.get<EstimateDto[]>(
    API_ENDPOINTS.ESTIMATES.BY_WORKSPACE(workspaceId),
  );
  return response.data;
};

