/**
 * @file: estimate-table.dto.ts
 * @description: DTO для данных таблицы сметы
 * @created: 2025-01-04
 */

import type { ColumnDataType } from './estimate.dto';

/**
 * DTO для столбца в таблице (с информацией о правах доступа)
 */
export interface EstimateTableColumnDto {
  id: string;
  name: string;
  dataType: ColumnDataType;
  order: number;
  canEdit: boolean; // Может ли текущий пользователь редактировать этот столбец
  allowedValues: string[] | null; // Разрешенные значения для ENUM типа
}

/**
 * DTO для ячейки
 */
export interface EstimateTableCellDto {
  id: string;
  rowId: string;
  columnId: string;
  value: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO для строки с ячейками
 */
export interface EstimateTableRowDto {
  id: string;
  estimateId: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  cells: EstimateTableCellDto[];
}

/**
 * DTO для данных таблицы сметы
 */
export interface EstimateTableDataDto {
  columns: EstimateTableColumnDto[];
  rows: EstimateTableRowDto[];
}

/**
 * DTO для создания строки
 */
export interface CreateEstimateRowDto {
  estimateId: string;
  order?: number;
}

/**
 * DTO для обновления ячейки
 */
export interface UpdateCellDto {
  value?: string;
  reason?: string;
  rowId?: string; // Для создания ячейки, если её нет
  columnId?: string; // Для создания ячейки, если её нет
}

