/**
 * @file: DataTableFilterChips.tsx
 * @description: Компонент для отображения отдельных чипов для каждого выбранного значения фильтра
 * @dependencies: useDataTable
 * @created: 2025-01-04
 */

import { X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useDataTable } from '../../lib';
import type { DataTableFilterField } from '../../types';

interface DataTableFilterChipsProps<TData> {
  field: DataTableFilterField<TData>;
}

export function DataTableFilterChips<TData>({
  field,
}: DataTableFilterChipsProps<TData>) {
  const { table, columnFilters } = useDataTable();
  const valueStr = field.value as string;
  const column = table.getColumn(valueStr);
  const filterValue = columnFilters.find((i) => i.id === valueStr)?.value;

  // Для input фильтров - значение это строка, не массив
  // Для checkbox фильтров - значение это массив
  const filters =
    field.type === 'input'
      ? filterValue && typeof filterValue === 'string' && filterValue.trim()
        ? [filterValue]
        : []
      : filterValue
        ? Array.isArray(filterValue)
          ? filterValue
          : [filterValue]
        : [];

  if (filters.length === 0) return null;

  const handleRemoveFilter = (
    e: React.MouseEvent | React.KeyboardEvent,
    filterVal: string | number | boolean,
  ) => {
    console.log('[DataTableFilterChips] handleRemoveFilter called', {
      fieldType: field.type,
      filterVal,
      currentFilterValue: filterValue,
      columnId: valueStr,
      hasColumn: !!column,
    });
    
    e.stopPropagation();
    e.preventDefault();
    
    if (!column) {
      console.warn('[DataTableFilterChips] Column not found:', valueStr);
      return;
    }
    
    // Для input фильтров - просто сбрасываем фильтр
    if (field.type === 'input') {
      console.log('[DataTableFilterChips] Resetting input filter to undefined');
      // Используем undefined для полного сброса фильтра
      column.setFilterValue(undefined);
      console.log('[DataTableFilterChips] Filter value after reset:', column.getFilterValue());
      return;
    }
    
    // Для checkbox фильтров - удаляем конкретное значение из массива
    const newFilters = filters.filter((f) => f !== filterVal);
    console.log('[DataTableFilterChips] Updating checkbox filters:', {
      oldFilters: filters,
      newFilters,
    });
    column.setFilterValue(newFilters.length > 0 ? newFilters : undefined);
  };

  if (!column) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {filters.map((filterVal) => {
        // Находим label для значения (сравниваем как строки)
        const option = field.options?.find(
          (opt) => String(opt.value) === String(filterVal),
        );
        const label = option?.label || String(filterVal);

        return (
          <Button
            key={String(filterVal)}
            variant="outline"
            size="sm"
            className="h-5 rounded-full px-2 py-0 text-[10px]"
            onMouseDown={(e) => {
              // Используем onMouseDown вместо onClick, чтобы обработать событие раньше AccordionTrigger
              handleRemoveFilter(e, filterVal);
            }}
            onClick={(e) => {
              // Дублируем обработку для надежности
              e.stopPropagation();
            }}
            onKeyDown={(e) => {
              if (e.code === 'Enter' || e.code === 'Space') {
                handleRemoveFilter(e, filterVal);
              }
            }}
            type="button"
          >
            <div className="flex items-center gap-1">
              <span>{label}</span>
              <X className="h-2.5 w-2.5 text-muted-foreground" />
            </div>
          </Button>
        );
      })}
    </div>
  );
}

