/**
 * @file: estimate.dto.ts
 * @description: DTO для Estimate и EstimateColumn
 * @created: 2025-01-04
 */

/**
 * Тип данных столбца
 */
export type ColumnDataType = 'STRING' | 'NUMBER' | 'ENUM' | 'BOOLEAN' | 'DATE';

/**
 * DTO для сметы (ответ от API)
 */
export interface EstimateDto {
  id: string;
  workspaceId: string;
  createdById: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO для сметы с информацией о создателе
 */
export interface EstimateWithCreatorDto extends EstimateDto {
  createdBy: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

/**
 * DTO для столбца сметы
 */
export interface EstimateColumnDto {
  id: string;
  estimateId: string;
  createdById: string;
  name: string;
  dataType: ColumnDataType;
  order: number;
  required: boolean;
  allowedValues: string | null; // JSON строка для ENUM типа
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO для полной информации о смете (со столбцами и количеством строк)
 */
export interface EstimateFullDto extends EstimateWithCreatorDto {
  columns: EstimateColumnDto[];
  rowsCount: number;
}

