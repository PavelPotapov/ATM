/**
 * @file: create-estimate-column.dto.ts
 * @description: DTO для создания столбца сметы
 * @created: 2025-01-04
 */

import type { ColumnDataType } from './estimate.dto';

/**
 * DTO для создания нового столбца сметы
 */
export interface CreateEstimateColumnDto {
  estimateId: string;
  name: string;
  dataType: ColumnDataType;
  order: number;
  required?: boolean;
  allowedValues?: string[]; // Массив строк для ENUM типа
}

