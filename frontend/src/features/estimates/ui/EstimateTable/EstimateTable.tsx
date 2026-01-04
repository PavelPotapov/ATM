/**
 * @file: EstimateTable.tsx
 * @description: Компонент таблицы сметы с редактируемыми ячейками
 * @dependencies: @tanstack/react-table, DataTable widget, estimates API
 * @created: 2025-01-04
 */

import { useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  DataTableEnhanced,
  DataTableColumnHeader,
  type DataTableFilterField,
} from '@/widgets/table';
import {
  useEstimateTableData,
  useUpdateCell,
  useCreateEstimateRow,
  useDeleteEstimateRow,
} from '@/entities/estimates';
import { Button } from '@/shared/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { EditableCell } from './EditableCell';
import { Skeleton } from '@/shared/ui/skeleton';

interface EstimateTableProps {
  estimateId: string;
}

/**
 * Компонент таблицы сметы с редактируемыми ячейками
 */
export function EstimateTable({ estimateId }: EstimateTableProps) {
  const { data, isLoading, error } = useEstimateTableData(estimateId);
  const { mutate: updateCell, isPending: isUpdatingCell } = useUpdateCell();
  const { mutate: createRow, isPending: isCreatingRow } = useCreateEstimateRow();
  const { mutate: deleteRow, isPending: isDeletingRow } = useDeleteEstimateRow();

  // Преобразуем данные для таблицы
  const tableData = useMemo(() => {
    if (!data) return [];

    // Преобразуем строки в формат для таблицы
    return data.rows.map((row) => {
      const rowData: Record<string, unknown> = {
        _rowId: row.id,
        _rowOrder: row.order,
      };

      // Добавляем ячейки по столбцам
      data.columns.forEach((column) => {
        const cell = row.cells.find((c) => c.columnId === column.id);
        rowData[column.id] = {
          value: cell?.value ?? null,
          cellId: cell?.id ?? null,
          columnId: column.id,
          dataType: column.dataType,
          canEdit: column.canEdit,
        } as {
          value: string | null;
          cellId: string | null;
          columnId: string;
          dataType: string;
          canEdit: boolean;
        };
      });

      return rowData;
    });
  }, [data]);

  // Создаем колонки для таблицы
  const columns = useMemo<ColumnDef<typeof tableData[0]>[]>(() => {
    if (!data) return [];

    const cols: ColumnDef<typeof tableData[0]>[] = [
      // Колонка с номером строки и действиями
      {
        id: '_actions',
        header: '',
        size: 80,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">{row.index + 1}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive hover:text-destructive"
              onClick={() => {
                const rowId = row.original._rowId as string;
                deleteRow({ rowId, estimateId });
              }}
              disabled={isDeletingRow}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ),
        enableResizing: false,
      },
    ];

    // Добавляем колонки из данных
    data.columns.forEach((column) => {
      cols.push({
        id: column.id,
        header: ({ column: col }) => (
          <DataTableColumnHeader column={col} title={column.name} />
        ),
        enableSorting: true,
        enableHiding: true,
        meta: {
          label: column.name,
        },
        size: 150,
        // Кастомная функция доступа к значению (извлекаем value из объекта)
        accessorFn: (row) => {
          const cellData = row[column.id] as {
            value: string | null;
            cellId: string | null;
            columnId: string;
            dataType: string;
            canEdit: boolean;
          } | undefined;
          return cellData?.value ?? null;
        },
        // Кастомная функция фильтрации для checkbox (массив значений)
        filterFn: (row, columnId, filterValue) => {
          // Если фильтр не установлен (null, undefined, пустая строка) - пропускаем все строки
          if (filterValue === null || filterValue === undefined || filterValue === '') {
            return true;
          }
          
          const cellData = row.original[columnId] as {
            value: string | null;
            cellId: string | null;
            columnId: string;
            dataType: string;
            canEdit: boolean;
          } | undefined;
          
          const cellValue = cellData?.value;
          if (!cellValue) return false;
          
          // Если фильтр - массив значений (checkbox)
          if (Array.isArray(filterValue)) {
            // Преобразуем все значения в строки для сравнения
            return filterValue.some(
              (fv) => String(fv) === String(cellValue),
            );
          }
          
          // Если фильтр - одно значение (input)
          if (typeof filterValue === 'string') {
            return cellValue.toLowerCase().includes(filterValue.toLowerCase());
          }
          
          return false;
        },
        cell: ({ row }) => {
          const cellData = row.original[column.id] as {
            value: string | null;
            cellId: string | null;
            columnId: string;
            dataType: string;
            canEdit: boolean;
          } | undefined;
          if (!cellData) return null;

          return (
            <EditableCell
              value={cellData.value}
              cellId={cellData.cellId}
              columnId={column.id}
              dataType={column.dataType}
              canEdit={cellData.canEdit}
              allowedValues={
                column.dataType === 'ENUM'
                  ? data.columns.find((c) => c.id === column.id)?.allowedValues ?? null
                  : null
              }
              onUpdate={(value) => {
                if (cellData.cellId) {
                  updateCell({
                    cellId: cellData.cellId,
                    estimateId,
                    data: { value },
                  });
                }
              }}
              isUpdating={isUpdatingCell}
            />
          );
        },
      });
    });

    return cols;
  }, [data, estimateId, updateCell, deleteRow, isUpdatingCell, isDeletingRow]);

  // Определяем фильтры для таблицы
  const filterFields = useMemo<DataTableFilterField<typeof tableData[0]>[]>(() => {
    if (!data) return [];

    return data.columns.map((col) => {
      // Для ENUM столбцов используем checkbox фильтр с опциями
      if (col.dataType === 'ENUM' && col.allowedValues && col.allowedValues.length > 0) {
        return {
          type: 'checkbox' as const,
          label: col.name,
          value: col.id,
          commandDisabled: false,
          options: col.allowedValues.map((val) => ({
            label: val,
            value: val,
          })),
        };
      }

      // Для NUMBER столбцов можно использовать slider (пока используем input)
      if (col.dataType === 'NUMBER') {
        return {
          type: 'input' as const,
          label: col.name,
          value: col.id,
          commandDisabled: false,
        };
      }

      // Для остальных - input фильтр
      return {
        type: 'input' as const,
        label: col.name,
        value: col.id,
        commandDisabled: false,
      };
    });
  }, [data]);

  const handleAddRow = () => {
    createRow({ estimateId });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive p-4">
        <p className="text-sm text-destructive">
          Ошибка загрузки данных таблицы:{' '}
          {error instanceof Error ? error.message : 'Неизвестная ошибка'}
        </p>
      </div>
    );
  }

  if (!data || data.rows.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Таблица пуста. Добавьте первую строку для начала работы.
          </p>
          <Button onClick={handleAddRow} disabled={isCreatingRow} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Добавить строку
          </Button>
        </div>
      </div>
    );
  }

  return (
    <DataTableEnhanced
      columns={columns}
      data={tableData}
      filterFields={filterFields}
      isLoading={isLoading}
      getRowId={(row) => (row._rowId as string) || ''}
      renderActions={() => (
        <Button onClick={handleAddRow} disabled={isCreatingRow} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          {isCreatingRow ? 'Добавление...' : 'Добавить строку'}
        </Button>
      )}
      renderSheetContent={(row) => (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Детали строки</h3>
            <p className="text-sm text-muted-foreground">
              Строка #{row._rowOrder as number}
            </p>
          </div>
          <div className="space-y-2">
            {data.columns.map((column) => {
              const cellData = row[column.id] as {
                value: string | null;
                cellId: string | null;
                columnId: string;
                dataType: string;
                canEdit: boolean;
              } | undefined;
              return (
                <div key={column.id} className="border-b pb-2">
                  <p className="text-sm font-medium">{column.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {cellData?.value ?? '—'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    />
  );
}

