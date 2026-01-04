/**
 * @file: update-estimate-column.dto.ts
 * @description: DTO для обновления столбца сметы
 * @created: 2025-01-04
 */

import type { ColumnDataType } from './estimate.dto';

/**
 * DTO для обновления столбца сметы (все поля опциональны)
 */
export interface UpdateEstimateColumnDto {
  name?: string;
  dataType?: ColumnDataType;
  order?: number;
  required?: boolean;
  allowedValues?: string[]; // Массив строк для ENUM типа
}

