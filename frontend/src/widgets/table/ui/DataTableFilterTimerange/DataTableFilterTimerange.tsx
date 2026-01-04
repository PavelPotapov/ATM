/**
 * @file: DataTableFilterTimerange.tsx
 * @description: Компонент фильтра типа timerange (диапазон дат)
 * @dependencies: useDataTable, DatePickerWithRange, isArrayOfDates
 * @created: 2025-01-04
 */

import { useMemo } from 'react';
import type { DateRange } from 'react-day-picker';
import { useDataTable } from '../../lib';
import { DatePickerWithRange } from '@/shared/ui/date-picker-with-range';
import { isArrayOfDates } from '@/shared/lib/is-array';
import type { DataTableTimerangeFilterField } from '../../types';

export function DataTableFilterTimerange<TData>({
  value: _value,
  presets,
}: DataTableTimerangeFilterField<TData>) {
  const value = _value as string;
  const { table, columnFilters } = useDataTable();
  const column = table.getColumn(value);
  const filterValue = columnFilters.find((i) => i.id === value)?.value;

  const date: DateRange | undefined = useMemo(
    () =>
      filterValue instanceof Date
        ? { from: filterValue, to: undefined }
        : Array.isArray(filterValue) && isArrayOfDates(filterValue)
          ? { from: filterValue?.[0], to: filterValue?.[1] }
          : undefined,
    [filterValue],
  );

  const setDate = (date: DateRange | undefined) => {
    if (!date) {
      // Удаляем фильтр, если дата не выбрана
      column?.setFilterValue(undefined);
      return;
    }
    if (date.from && !date.to) {
      column?.setFilterValue([date.from]);
    }
    if (date.to && date.from) {
      column?.setFilterValue([date.from, date.to]);
    }
  };

  return <DatePickerWithRange date={date} setDate={setDate} presets={presets} />;
}

