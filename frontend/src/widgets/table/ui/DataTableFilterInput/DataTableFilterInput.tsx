/**
 * @file: DataTableFilterInput.tsx
 * @description: Компонент фильтра типа input
 * @dependencies: useDataTable, InputWithAddons, useFilterInput
 * @created: 2025-01-04
 */

import { Search } from 'lucide-react';
import { Label } from '@/shared/ui/label';
import { InputWithAddons } from '@/shared/ui/input-with-addons';
import { useDataTable, useFilterInput } from '../../lib';
import type { DataTableInputFilterField } from '../../types';

function getFilter(filterValue: unknown): string | null {
  return typeof filterValue === 'string' ? filterValue : null;
}

export function DataTableFilterInput<TData>({
  value: _value,
}: DataTableInputFilterField<TData>) {
  const value = _value as string;
  const { table, columnFilters } = useDataTable();
  const column = table.getColumn(value);
  const filterValue = columnFilters.find((i) => i.id === value)?.value;
  const filters = getFilter(filterValue);

  const { input, setInput } = useFilterInput({
    filterValue: filters,
    onApply: (newValue) => {
      column?.setFilterValue(newValue);
    },
  });

  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor={value} className="sr-only px-2 text-muted-foreground">
        {value}
      </Label>
      <InputWithAddons
        placeholder="Поиск"
        leading={<Search className="mt-0.5 h-4 w-4" />}
        containerClassName="h-9 rounded-lg"
        name={value}
        id={value}
        value={input || ''}
        onChange={(e) => setInput(e.target.value)}
      />
    </div>
  );
}
