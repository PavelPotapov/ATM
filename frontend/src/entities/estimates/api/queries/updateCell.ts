/**
 * @file: updateCell.ts
 * @description: Запрос для обновления ячейки
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-04
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';
import type { UpdateCellDto, EstimateTableCellDto } from '../dto/estimate-table.dto';

/**
 * Обновить значение ячейки
 * @param cellId - ID ячейки
 * @param data - данные для обновления
 * @returns обновленная ячейка
 */
export const updateCell = async (
  cellId: string,
  data: UpdateCellDto,
): Promise<EstimateTableCellDto> => {
  const response = await apiClient.patch<EstimateTableCellDto>(
    API_ENDPOINTS.ESTIMATES.UPDATE_CELL(cellId),
    data,
  );
  return response.data;
};

