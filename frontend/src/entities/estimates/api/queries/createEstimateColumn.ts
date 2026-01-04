/**
 * @file: createEstimateColumn.ts
 * @description: Запрос для создания столбца сметы
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-04
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';
import type { CreateEstimateColumnDto } from '../dto/create-estimate-column.dto';
import type { EstimateColumnDto } from '../dto/estimate.dto';

/**
 * Создать новый столбец сметы
 * @param data - данные для создания столбца
 * @returns созданный столбец
 */
export const createEstimateColumn = async (
  data: CreateEstimateColumnDto,
): Promise<EstimateColumnDto> => {
  const response = await apiClient.post<EstimateColumnDto>(
    API_ENDPOINTS.ESTIMATES.CREATE_COLUMN(data.estimateId),
    data,
  );
  return response.data;
};

