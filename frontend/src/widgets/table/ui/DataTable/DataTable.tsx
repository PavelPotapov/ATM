/**
 * @file: DataTable.tsx
 * @description: Базовый виджет таблицы на основе TanStack Table
 * @dependencies: @tanstack/react-table
 * @created: 2025-01-XX
 */

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
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
  cvaTableCaption,
  cvaTableEmptyCell,
  cvaResizeHandle,
  cvaResizeHandleActive,
} from './styles/DataTable.styles';

interface DataTableProps<TData> {
  /**
   * Колонки таблицы
   */
  columns: ColumnDef<TData>[];
  /**
   * Данные для отображения
   */
  data: TData[];
  /**
   * Опциональный заголовок таблицы
   */
  caption?: string;
}

/**
 * Базовый компонент таблицы на основе TanStack Table
 * 
 * @example
 * ```tsx
 * const columns = [
 *   { accessorKey: 'name', header: 'Имя' },
 *   { accessorKey: 'email', header: 'Email' },
 * ];
 * 
 * <DataTable columns={columns} data={users} />
 * ```
 */
export function DataTable<TData>({
  columns,
  data,
  caption,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: true,
    columnResizeMode: 'onChange', // Моментальное обновление во время перетаскивания
    defaultColumn: {
      size: 150,
      minSize: 20,
      maxSize: Number.MAX_SAFE_INTEGER,
    },
  });

  return (
    <div className={cvaTableWrapper()}>
      <Table className={cvaTable()}>
        {caption && (
          <TableCaption className={cvaTableCaption()}>{caption}</TableCaption>
        )}
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
                    overflow: 'hidden', // Предотвращаем выход handle за границы колонки
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
                        header.column.getIsResizing() ? cvaResizeHandleActive() : ''
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
                data-state={row.getIsSelected() && 'selected'}
                className={cvaTableRow()}
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
  );
}

