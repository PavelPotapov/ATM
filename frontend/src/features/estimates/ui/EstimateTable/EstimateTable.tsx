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
import { isAfter, isBefore, isSameDay } from 'date-fns';
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
        // Кастомная функция фильтрации в зависимости от типа данных
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
          const cellDataType = cellData?.dataType;
          if (!cellValue) return false;
          
          // Для DATE столбцов используем inDateRange
          if (cellDataType === 'DATE') {
            // Преобразуем строку в Date для фильтрации
            const cellDate = new Date(cellValue);
            if (Number.isNaN(cellDate.getTime())) return false;
            
            // Используем логику inDateRange для фильтрации
            // Если value - массив дат [start, end]
            if (Array.isArray(filterValue)) {
              const dates = filterValue.filter((v) => v instanceof Date) as Date[];
              if (dates.length === 0) return false;
              
              const [start, end] = dates;
              
              // Если нет конечной даты, проверяем, что это тот же день
              if (!end) {
                return isSameDay(cellDate, start);
              }
              
              // Проверяем, что дата попадает в диапазон
              return (isAfter(cellDate, start) || isSameDay(cellDate, start)) && 
                     (isBefore(cellDate, end) || isSameDay(cellDate, end));
            }
            
            // Если value - одна дата
            if (filterValue instanceof Date) {
              return isSameDay(cellDate, filterValue);
            }
            
            return false;
          }
          
          // Если фильтр - массив значений (checkbox для ENUM/BOOLEAN)
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
              rowId={row.original._rowId as string}
              columnId={column.id}
              dataType={column.dataType}
              canEdit={cellData.canEdit}
              allowedValues={
                column.dataType === 'ENUM'
                  ? data.columns.find((c) => c.id === column.id)?.allowedValues ?? null
                  : null
              }
              onUpdate={(value) => {
                // Если ячейка существует - обновляем, иначе создаем новую
                const cellIdToUse = cellData.cellId || 'new';
                updateCell({
                  cellId: cellIdToUse,
                  estimateId,
                  data: {
                    value,
                    // Всегда передаем rowId и columnId для оптимистичного обновления
                    rowId: row.original._rowId as string,
                    columnId: column.id,
                  },
                });
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

      // Для BOOLEAN столбцов используем checkbox фильтр с опциями Да/Нет
      if (col.dataType === 'BOOLEAN') {
        return {
          type: 'checkbox' as const,
          label: col.name,
          value: col.id,
          commandDisabled: false,
          options: [
            { label: 'Да', value: 'true' },
            { label: 'Нет', value: 'false' },
          ],
        };
      }

      // Для DATE столбцов используем timerange фильтр
      if (col.dataType === 'DATE') {
        return {
          type: 'timerange' as const,
          label: col.name,
          value: col.id,
          commandDisabled: false,
        };
      }

      // Для NUMBER столбцов используем input (можно будет добавить slider позже)
      if (col.dataType === 'NUMBER') {
        return {
          type: 'input' as const,
          label: col.name,
          value: col.id,
          commandDisabled: false,
        };
      }

      // Для STRING и остальных - input фильтр
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
      paginationKey={`estimate-${estimateId}`}
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

