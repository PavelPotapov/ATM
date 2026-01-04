/**
 * @file: updateEstimateColumn.ts
 * @description: Запрос для обновления столбца сметы
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-04
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';
import type { UpdateEstimateColumnDto } from '../dto/update-estimate-column.dto';
import type { EstimateColumnDto } from '../dto/estimate.dto';

/**
 * Обновить столбец сметы
 * @param columnId - ID столбца
 * @param data - данные для обновления
 * @returns обновленный столбец
 */
export const updateEstimateColumn = async (
  columnId: string,
  data: UpdateEstimateColumnDto,
): Promise<EstimateColumnDto> => {
  const response = await apiClient.patch<EstimateColumnDto>(
    API_ENDPOINTS.ESTIMATES.UPDATE_COLUMN(columnId),
    data,
  );
  return response.data;
};

