/**
 * @file: updateEstimate.ts
 * @description: Запрос для обновления сметы
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-04
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';
import type { UpdateEstimateDto } from '../dto/update-estimate.dto';
import type { EstimateDto } from '../dto/estimate.dto';

/**
 * Обновить смету
 * @param id - ID сметы
 * @param data - данные для обновления
 * @returns обновленная смета
 */
export const updateEstimate = async (
  id: string,
  data: UpdateEstimateDto,
): Promise<EstimateDto> => {
  const response = await apiClient.patch<EstimateDto>(
    API_ENDPOINTS.ESTIMATES.UPDATE(id),
    data,
  );
  return response.data;
};

