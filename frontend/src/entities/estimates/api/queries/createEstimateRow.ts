/**
 * @file: createEstimateRow.ts
 * @description: Запрос для создания строки сметы
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-04
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';
import type { CreateEstimateRowDto, EstimateTableRowDto } from '../dto/estimate-table.dto';

/**
 * Создать новую строку сметы
 * @param estimateId - ID сметы
 * @param data - данные для создания строки
 * @returns созданная строка с ячейками
 */
export const createEstimateRow = async (
  estimateId: string,
  data?: Omit<CreateEstimateRowDto, 'estimateId'>,
): Promise<EstimateTableRowDto> => {
  const response = await apiClient.post<EstimateTableRowDto>(
    API_ENDPOINTS.ESTIMATES.CREATE_ROW(estimateId),
    { ...data, estimateId },
  );
  return response.data;
};

