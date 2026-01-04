/**
 * @file: getEstimateTableData.ts
 * @description: Запрос для получения данных таблицы сметы
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-04
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';
import type { EstimateTableDataDto } from '../dto/estimate-table.dto';

/**
 * Получить данные таблицы сметы (строки с ячейками)
 * @param estimateId - ID сметы
 * @returns данные таблицы с учетом прав доступа
 */
export const getEstimateTableData = async (
  estimateId: string,
): Promise<EstimateTableDataDto> => {
  const response = await apiClient.get<EstimateTableDataDto>(
    API_ENDPOINTS.ESTIMATES.GET_TABLE_DATA(estimateId),
  );
  return response.data;
};

