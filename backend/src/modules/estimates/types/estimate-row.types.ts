/**
 * @file: estimate-row.types.ts
 * @description: Типы для строк сметы (EstimateRow) и ячеек (Cell)
 * @dependencies: @prisma/client
 * @created: 2025-01-04
 */

/**
 * EstimateRowType - тип строки сметы
 */
export interface EstimateRowType {
  id: string;
  estimateId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * CellType - тип ячейки
 */
export interface CellType {
  id: string;
  rowId: string;
  columnId: string;
  value: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * EstimateRowWithCells - строка с ячейками
 */
export interface EstimateRowWithCells extends EstimateRowType {
  cells: CellType[];
}

/**
 * EstimateTableData - данные таблицы сметы (строки с ячейками)
 * С учетом прав доступа - только видимые столбцы
 */
export interface EstimateTableData {
  columns: Array<{
    id: string;
    name: string;
    dataType: string;
    order: number;
    canEdit: boolean; // Может ли текущий пользователь редактировать этот столбец
  }>;
  rows: EstimateRowWithCells[];
}

