/**
 * @file: DataTableFilterResetButton.tsx
 * @description: Кнопка сброса отдельного фильтра
 * @dependencies: useDataTable
 * @created: 2025-01-04
 */

import { X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useDataTable } from '../../lib';
import type { DataTableFilterField } from '../../types';

interface DataTableFilterResetButtonProps<TData> {
  value: keyof TData;
  type?: DataTableFilterField<TData>['type'];
  options?: DataTableFilterField<TData>['options'];
}

export function DataTableFilterResetButton<TData>({
  value,
  type,
  options,
}: DataTableFilterResetButtonProps<TData>) {
  const { table, columnFilters } = useDataTable();
  const valueStr = value as string;
  const column = table.getColumn(valueStr);
  const filterValue = columnFilters.find((i) => i.id === valueStr)?.value;

  const filters = filterValue
    ? Array.isArray(filterValue)
      ? filterValue
      : [filterValue]
    : [];

  if (filters.length === 0) return null;

  // Для checkbox фильтров показываем значения, а не только количество
  const displayText =
    type === 'checkbox' && options && filters.length <= 3
      ? filters
          .map((filterVal) => {
            const option = options.find((opt) => opt.value === filterVal);
            return option?.label || String(filterVal);
          })
          .join(', ')
      : String(filters.length);

  return (
    <Button
      variant="outline"
      className="h-5 rounded-full px-1.5 py-1 font-mono text-[10px]"
      onClick={(e) => {
        e.stopPropagation();
        column?.setFilterValue(undefined);
      }}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.code === 'Enter') {
          column?.setFilterValue(undefined);
        }
      }}
      asChild
    >
      <div role="button" tabIndex={0}>
        <span>{displayText}</span>
        <X className="ml-1 h-2.5 w-2.5 text-muted-foreground" />
      </div>
    </Button>
  );
}

