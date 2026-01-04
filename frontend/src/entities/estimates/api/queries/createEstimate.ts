/**
 * @file: createEstimate.ts
 * @description: Запрос для создания сметы
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-04
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';
import type { CreateEstimateDto } from '../dto/create-estimate.dto';
import type { EstimateDto } from '../dto/estimate.dto';

/**
 * Создать новую смету
 * @param data - данные для создания сметы
 * @returns созданная смета
 */
export const createEstimate = async (
  data: CreateEstimateDto,
): Promise<EstimateDto> => {
  const response = await apiClient.post<EstimateDto>(
    API_ENDPOINTS.ESTIMATES.CREATE,
    data,
  );
  return response.data;
};

