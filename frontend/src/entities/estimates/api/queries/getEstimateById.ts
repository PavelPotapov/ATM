/**
 * @file: getEstimateById.ts
 * @description: Запрос для получения сметы по ID
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-04
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';
import type { EstimateWithCreatorDto, EstimateFullDto } from '../dto/estimate.dto';

/**
 * Получить смету по ID
 * @param id - ID сметы
 * @param full - получить полную информацию (со столбцами и количеством строк)
 * @returns смета
 */
export const getEstimateById = async (
  id: string,
  full?: boolean,
): Promise<EstimateWithCreatorDto | EstimateFullDto> => {
  const url = full
    ? `${API_ENDPOINTS.ESTIMATES.BY_ID(id)}?full=true`
    : API_ENDPOINTS.ESTIMATES.BY_ID(id);
  const response = await apiClient.get<EstimateWithCreatorDto | EstimateFullDto>(url);
  return response.data;
};

