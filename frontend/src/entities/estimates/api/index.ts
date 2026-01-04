/**
 * @file: index.ts
 * @description: Публичный API модуля estimates
 * @created: 2025-01-04
 */

// Экспорт типов
export type {
  EstimateDto,
  EstimateWithCreatorDto,
  EstimateFullDto,
  EstimateColumnDto,
  ColumnDataType,
} from './dto/estimate.dto';
export type { CreateEstimateDto } from './dto/create-estimate.dto';
export type { UpdateEstimateDto } from './dto/update-estimate.dto';
export type { CreateEstimateColumnDto } from './dto/create-estimate-column.dto';
export type { UpdateEstimateColumnDto } from './dto/update-estimate-column.dto';
export type {
  ColumnRolePermissionDto,
  CreateColumnPermissionDto,
  UpdateColumnPermissionDto,
  Role,
} from './dto/column-permission.dto';
export type { EstimateColumnFullDto } from './dto/estimate-column-full.dto';
export type { ColumnHistoryDto } from './dto/column-history.dto';
export type {
  EstimateTableDataDto,
  EstimateTableColumnDto,
  EstimateTableRowDto,
  EstimateTableCellDto,
  CreateEstimateRowDto,
  UpdateCellDto,
} from './dto/estimate-table.dto';

// Экспорт query keys
export { estimatesKeys } from './queryKeys';

// Экспорт queries (опционально, если нужны напрямую)
export { getEstimatesByWorkspace } from './queries/getEstimatesByWorkspace';
export { getEstimateById } from './queries/getEstimateById';
export { createEstimate } from './queries/createEstimate';
export { updateEstimate } from './queries/updateEstimate';
export { deleteEstimate } from './queries/deleteEstimate';
export { createEstimateColumn } from './queries/createEstimateColumn';
export { updateEstimateColumn } from './queries/updateEstimateColumn';
export { deleteEstimateColumn } from './queries/deleteEstimateColumn';
export { getEstimateColumnFull } from './queries/getEstimateColumnFull';
export { getColumnHistory } from './queries/getColumnHistory';
export { createColumnPermission } from './queries/createColumnPermission';
export { updateColumnPermission } from './queries/updateColumnPermission';
export { deleteColumnPermission } from './queries/deleteColumnPermission';

// Экспорт hooks (основной способ использования)
export { useEstimatesByWorkspace } from './hooks/useEstimatesByWorkspace';
export { useEstimate } from './hooks/useEstimate';
export { useCreateEstimate } from './hooks/useCreateEstimate';
export { useUpdateEstimate } from './hooks/useUpdateEstimate';
export { useDeleteEstimate } from './hooks/useDeleteEstimate';
export { useCreateEstimateColumn } from './hooks/useCreateEstimateColumn';
export { useUpdateEstimateColumn } from './hooks/useUpdateEstimateColumn';
export { useDeleteEstimateColumn } from './hooks/useDeleteEstimateColumn';
export { useEstimateColumnFull } from './hooks/useEstimateColumnFull';
export { useColumnHistory } from './hooks/useColumnHistory';
export { useCreateColumnPermission } from './hooks/useCreateColumnPermission';
export { useUpdateColumnPermission } from './hooks/useUpdateColumnPermission';
export { useDeleteColumnPermission } from './hooks/useDeleteColumnPermission';
export { useEstimateTableData } from './hooks/useEstimateTableData';
export { useCreateEstimateRow } from './hooks/useCreateEstimateRow';
export { useDeleteEstimateRow } from './hooks/useDeleteEstimateRow';
export { useUpdateCell } from './hooks/useUpdateCell';

