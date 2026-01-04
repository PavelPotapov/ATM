/**
 * @file: getEstimateColumnFull.ts
 * @description: Запрос для получения полной информации о столбце
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-04
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';
import type { EstimateColumnFullDto } from '../dto/estimate-column-full.dto';

/**
 * Получить полную информацию о столбце (с создателем и разрешениями)
 * @param columnId - ID столбца
 * @returns полная информация о столбце
 */
export const getEstimateColumnFull = async (
  columnId: string,
): Promise<EstimateColumnFullDto> => {
  const response = await apiClient.get<EstimateColumnFullDto>(
    API_ENDPOINTS.ESTIMATES.GET_COLUMN_FULL(columnId),
  );
  return response.data;
};

