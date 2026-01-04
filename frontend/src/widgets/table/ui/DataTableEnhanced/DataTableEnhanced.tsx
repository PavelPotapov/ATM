/**
 * @file: DataTableEnhanced.tsx
 * @description: Расширенная версия таблицы с поддержкой фильтров, поиска, сортировки, пагинации
 * @dependencies: @tanstack/react-table, DataTableProvider, DataTableToolbar, DataTableFilterControls, DataTableFilterCommand
 * @created: 2025-01-04
 */

import * as React from 'react';
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  Table as TTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useLocalStorage } from '@/shared/hooks';
import { cn } from '@/shared/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/table';
import {
  cvaTable,
  cvaTableHeader,
  cvaTableHeaderRow,
  cvaTableHeaderCell,
  cvaTableBody,
  cvaTableRow,
  cvaTableCell,
  cvaTableWrapper,
  cvaTableEmptyCell,
  cvaResizeHandle,
  cvaResizeHandleActive,
} from '../DataTable/styles/DataTable.styles';
import { DataTableProvider } from '../../lib';
import { DataTableToolbar } from '../DataTableToolbar';
import { DataTableFilterControls } from '../DataTableFilterControls';
import { DataTableFilterCommand } from '../DataTableFilterCommand';
import { DataTablePagination } from '../DataTablePagination';
import { DataTableSheetDetails } from '../DataTableSheet';
import type { DataTableFilterField } from '../../types';
import type { ParserBuilder } from 'nuqs';

export interface DataTableEnhancedProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultColumnFilters?: ColumnFiltersState;
  defaultColumnSorting?: SortingState;
  defaultRowSelection?: RowSelectionState;
  defaultColumnVisibility?: VisibilityState;
  filterFields?: DataTableFilterField<TData>[];
  searchParamsParser?: Record<string, ParserBuilder<any>>;
  isLoading?: boolean;
  enableColumnOrdering?: boolean;
  renderActions?: () => React.ReactNode;
  renderSheetContent?: (row: TData) => React.ReactNode;
  getRowId?: (row: TData) => string;
  getRowClassName?: (row: TData) => string;
  /**
   * Уникальный ключ для сохранения пагинации в localStorage.
   * Если не указан, пагинация не сохраняется между сессиями.
   */
  paginationKey?: string;
}

export function DataTableEnhanced<TData, TValue>({
  columns,
  data,
  defaultColumnFilters = [],
  defaultColumnSorting = [],
  defaultRowSelection = {},
  defaultColumnVisibility = {},
  filterFields = [],
  searchParamsParser = {},
  isLoading = false,
  enableColumnOrdering = false,
  renderActions,
  renderSheetContent,
  getRowId,
  getRowClassName,
  paginationKey,
}: DataTableEnhancedProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>(defaultColumnFilters);
  const [sorting, setSorting] =
    React.useState<SortingState>(defaultColumnSorting);
  const [rowSelection, setRowSelection] =
    React.useState<RowSelectionState>(defaultRowSelection);
  const [columnOrder, setColumnOrder] = useLocalStorage<string[]>(
    'data-table-column-order',
    [],
  );
  const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>(
    'data-table-visibility',
    defaultColumnVisibility,
  );
  
  // Сохраняем пагинацию в localStorage, если указан ключ
  const defaultPagination: PaginationState = {
    pageIndex: 0,
    pageSize: 10,
  };
  
  const [paginationLS, setPaginationLS] = useLocalStorage<PaginationState>(
    paginationKey ? `data-table-pagination-${paginationKey}` : 'data-table-pagination-temp',
    defaultPagination,
  );
  
  const [paginationState, setPaginationState] = React.useState<PaginationState>(defaultPagination);
  
  // Используем localStorage, если указан ключ, иначе обычный state
  const pagination = paginationKey ? paginationLS : paginationState;
  const setPagination = paginationKey ? setPaginationLS : setPaginationState;
  
  // Отслеживаем предыдущие фильтры, чтобы определить, изменились ли они
  const previousColumnFiltersRef = React.useRef<ColumnFiltersState>(columnFilters);
  
  // Сбрасываем пагинацию при изменении фильтров (но не при обновлении данных)
  React.useEffect(() => {
    const currentFilters = columnFilters;
    const previousFilters = previousColumnFiltersRef.current;
    
    // Сравниваем фильтры (проверяем, изменились ли они)
    const filtersChanged = 
      currentFilters.length !== previousFilters.length ||
      currentFilters.some((filter, index) => {
        const prevFilter = previousFilters[index];
        return !prevFilter || 
               prevFilter.id !== filter.id || 
               JSON.stringify(prevFilter.value) !== JSON.stringify(filter.value);
      });
    
    // Если фильтры изменились - сбрасываем пагинацию на первую страницу
    if (filtersChanged && pagination.pageIndex > 0) {
      console.log('[DataTableEnhanced] Filters changed, resetting pagination to first page');
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    }
    
    // Обновляем ref
    previousColumnFiltersRef.current = columnFilters;
  }, [columnFilters, pagination.pageIndex, setPagination]);
  

  // Кастомная функция для getFacetedUniqueValues, которая работает с вложенной структурой
  // Создаем свою реализацию, которая использует accessorFn из колонок
  const customGetFacetedUniqueValues = React.useMemo(
    () => (table: TTable<TData>, columnId: string) => {
      return () => {
        try {
          const column = table.getColumn(columnId);
          if (!column) return new Map();

          const facetedValues = new Map<string | number | boolean, number>();
          const rows = table.getCoreRowModel().rows;

          rows.forEach((row) => {
            // Получаем значение через accessorFn (который мы настроили в колонках)
            let value: unknown;
            if (column.columnDef.accessorFn) {
              try {
                value = column.columnDef.accessorFn(row.original, row.index);
              } catch {
                value = null;
              }
            } else {
              // Fallback: пытаемся получить напрямую
              const cellData = row.original[columnId] as
                | {
                    value: string | null;
                  }
                | undefined;
              value = cellData?.value ?? null;
            }

            if (value !== null && value !== undefined) {
              const key = String(value);
              const count = facetedValues.get(key) || 0;
              facetedValues.set(key, count + 1);
            }
          });

          return facetedValues;
        } catch (error) {
          // Если ошибка - возвращаем пустую Map
          console.warn('Error getting faceted unique values:', error);
          return new Map();
        }
      };
    },
    [data],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      sorting,
      columnVisibility,
      rowSelection,
      pagination,
    },
    enableRowSelection: !!renderSheetContent,
    enableMultiRowSelection: false,
    // Отключаем автоматический сброс пагинации при изменении данных
    // Сброс при фильтрации обрабатываем вручную через useEffect
    autoResetPageIndex: false,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onColumnOrderChange: setColumnOrder,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    getFacetedUniqueValues: customGetFacetedUniqueValues,
    getRowId,
    enableColumnResizing: true,
    enableSorting: true,
    columnResizeMode: 'onChange',
    defaultColumn: {
      size: 150,
      minSize: 20,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
  });

  return (
    <DataTableProvider
      table={table}
      columns={columns}
      filterFields={filterFields}
      isLoading={isLoading}
      columnFilters={columnFilters}
      sorting={sorting}
      rowSelection={rowSelection}
      columnOrder={columnOrder}
      columnVisibility={columnVisibility}
      pagination={pagination}
      enableColumnOrdering={enableColumnOrdering}
      getFacetedUniqueValues={customGetFacetedUniqueValues}
      getFacetedMinMaxValues={getFacetedMinMaxValues()}
    >
      <div className="space-y-4">
        {/* Тулбар с поиском и опциями */}
        <div className="space-y-2">
          {searchParamsParser && Object.keys(searchParamsParser).length > 0 && (
            <DataTableFilterCommand searchParamsParser={searchParamsParser} />
          )}
          <DataTableToolbar renderActions={renderActions} />
        </div>

        <div className="flex gap-4">
          {/* Панель фильтров */}
          {filterFields && filterFields.length > 0 && (
            <aside className="hidden w-64 shrink-0 sm:block group-data-[expanded=false]/controls:hidden">
              <DataTableFilterControls />
            </aside>
          )}

          {/* Основная таблица */}
          <div className="flex-1 space-y-4">
            <div className={cvaTableWrapper()}>
              <Table className={cvaTable()}>
                <TableHeader className={cvaTableHeader()}>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className={cvaTableHeaderRow()}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className={cvaTableHeaderCell()}
                          style={{
                            width: `${header.getSize()}px`,
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                          {header.column.getCanResize() && (
                            <div
                              onMouseDown={header.getResizeHandler()}
                              onTouchStart={header.getResizeHandler()}
                              className={`${cvaResizeHandle()} ${
                                header.column.getIsResizing()
                                  ? cvaResizeHandleActive()
                                  : ''
                              }`}
                            />
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className={cvaTableBody()}>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        id={row.id}
                        data-state={row.getIsSelected() && 'selected'}
                        className={cn(
                          cvaTableRow(),
                          getRowClassName?.(row.original),
                          row.getIsSelected() && 'bg-muted/50',
                        )}
                        onClick={(e) => {
                          // Не открываем сайдбар при клике на редактируемую ячейку
                          const target = e.target as HTMLElement;
                          const isEditableCell =
                            target.closest('[data-editable-cell]') ||
                            target.closest('input') ||
                            target.closest('select') ||
                            target.closest('[role="combobox"]');
                          
                          if (!isEditableCell && renderSheetContent) {
                            table.setRowSelection({ [row.id]: true });
                          }
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className={cvaTableCell()}
                            style={{ width: `${cell.column.getSize()}px` }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className={cvaTableEmptyCell()}
                      >
                        Нет данных для отображения
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Пагинация */}
            <DataTablePagination />
          </div>
        </div>

        {/* Сайдбар с деталями строки */}
        {renderSheetContent && (
          <DataTableSheetDetails>
            {table.getSelectedRowModel().rows[0] && (
              <>{renderSheetContent(table.getSelectedRowModel().rows[0].original)}</>
            )}
          </DataTableSheetDetails>
        )}
      </div>
    </DataTableProvider>
  );
}

