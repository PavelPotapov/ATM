/**
 * @file: DataTable.styles.ts
 * @description: Стили для DataTable через CVA
 * @created: 2025-01-XX
 */

import { cva } from 'class-variance-authority';

export const cvaTable = cva([
  'data-table-cvaTable',
  'w-full border-collapse caption-bottom text-sm',
]);

export const cvaTableHeader = cva([
  'data-table-cvaTableHeader',
  'border-b',
]);

export const cvaTableHeaderRow = cva([
  'data-table-cvaTableHeaderRow',
  'border-b transition-colors hover:bg-muted/50',
]);

export const cvaTableHeaderCell = cva([
  'data-table-cvaTableHeaderCell',
  'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
  'overflow-hidden', // Предотвращаем выход индикатора ресайза за границы
]);

export const cvaTableBody = cva([
  'data-table-cvaTableBody',
  '[&_tr:last-child]:border-0',
]);

export const cvaTableRow = cva([
  'data-table-cvaTableRow',
  'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
]);

export const cvaTableCell = cva([
  'data-table-cvaTableCell',
  'p-4 align-middle',
]);

export const cvaTableCaption = cva([
  'data-table-cvaTableCaption',
  'mt-4 text-sm text-muted-foreground',
]);

export const cvaTableEmptyCell = cva([
  'data-table-cvaTableEmptyCell',
  'h-24 text-center',
]);

export const cvaTableWrapper = cva([
  'data-table-cvaTableWrapper',
  'rounded-md border',
]);

export const cvaResizeHandle = cva([
  'data-table-cvaResizeHandle',
  'absolute right-0 top-0 h-full w-1 cursor-col-resize touch-none select-none',
  'bg-border hover:bg-primary/20 active:bg-primary/30',
  'transition-colors',
]);

export const cvaResizeHandleActive = cva([
  'data-table-cvaResizeHandleActive',
  'bg-primary/50',
]);

