/**
 * @file: DataTableFilterCheckbox.tsx
 * @description: Компонент фильтра типа checkbox
 * @dependencies: useDataTable, Checkbox, InputWithAddons
 * @created: 2025-01-04
 */

import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Checkbox } from '@/shared/ui/checkbox';
import { Label } from '@/shared/ui/label';
import { Skeleton } from '@/shared/ui/skeleton';
import { InputWithAddons } from '@/shared/ui/input-with-addons';
import { formatCompactNumber } from '@/shared/lib/utils';
import { cn } from '@/shared/lib/utils';
import { useDataTable } from '../../lib';
import type { DataTableCheckboxFilterField } from '../../types';

export function DataTableFilterCheckbox<TData>({
  value: _value,
  options,
  component,
}: DataTableCheckboxFilterField<TData>) {
  const value = _value as string;
  const [inputValue, setInputValue] = useState('');
  const { table, columnFilters, isLoading, getFacetedUniqueValues } =
    useDataTable();
  const column = table.getColumn(value);
  const filterValue = columnFilters.find((i) => i.id === value)?.value;
  
  // Получаем facetedValue - это может быть функция или Map
  const facetedValue = useMemo(() => {
    // Сначала пробуем получить через getFacetedUniqueValues из провайдера
    if (getFacetedUniqueValues) {
      const resultFn = getFacetedUniqueValues(table, value);
      if (typeof resultFn === 'function') {
        const result = resultFn();
        if (result instanceof Map) {
          return result;
        }
      }
    }
    // Если нет - используем стандартный метод колонки
    const columnFaceted = column?.getFacetedUniqueValues();
    if (typeof columnFaceted === 'function') {
      const result = columnFaceted();
      if (result instanceof Map) {
        return result;
      }
    }
    return null;
  }, [table, value, column, getFacetedUniqueValues]);

  const Component = component;

  const filterOptions = useMemo(() => {
    if (!options) return [];
    return options.filter(
      (option) =>
        inputValue === '' ||
        option.label.toLowerCase().includes(inputValue.toLowerCase()),
    );
  }, [options, inputValue]);

  const filters = filterValue
    ? Array.isArray(filterValue)
      ? filterValue
      : [filterValue]
    : [];

  if (isLoading && (!filterOptions || filterOptions.length === 0))
    return (
      <div className="grid divide-y rounded-lg border border-border">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-2 px-2 py-2.5"
          >
            <Skeleton className="h-4 w-4 rounded-sm" />
            <Skeleton className="h-4 w-full rounded-sm" />
          </div>
        ))}
      </div>
    );

  return (
    <div className="grid gap-2">
      {options && options.length > 4 ? (
        <InputWithAddons
          placeholder="Поиск"
          leading={<Search className="mt-0.5 h-4 w-4" />}
          containerClassName="h-9 rounded-lg"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      ) : null}
      <div className="max-h-[200px] overflow-y-auto rounded-lg border border-border empty:border-none">
        {filterOptions && filterOptions.length > 0 ? (
          filterOptions.map((option, index) => {
          const checked = filters.includes(option.value);

          return (
            <div
              key={String(option.value)}
              className={cn(
                'group relative flex items-center space-x-2 px-2 py-2.5 hover:bg-accent/50',
                index !== filterOptions.length - 1 ? 'border-b' : undefined,
              )}
            >
              <Checkbox
                id={`${value}-${option.value}`}
                checked={checked}
                onCheckedChange={(checked) => {
                  const newValue = checked
                    ? [...(filters || []), option.value]
                    : filters?.filter((val) => option.value !== val);
                  column?.setFilterValue(
                    newValue?.length ? newValue : undefined,
                  );
                }}
              />
              <Label
                htmlFor={`${value}-${option.value}`}
                className="flex w-full items-center justify-center gap-1 truncate text-foreground/70 group-hover:text-accent-foreground"
              >
                {Component ? (
                  <Component {...option} />
                ) : (
                  <span className="truncate font-normal">{option.label}</span>
                )}
                <span className="ml-auto flex items-center justify-center font-mono text-xs">
                  {isLoading ? (
                    <Skeleton className="h-4 w-4" />
                  ) : facetedValue?.has(option.value) ? (
                    formatCompactNumber(facetedValue.get(option.value) || 0)
                  ) : null}
                </span>
                <button
                  type="button"
                  onClick={() => column?.setFilterValue([option.value])}
                  className={cn(
                    'absolute inset-y-0 right-0 hidden font-normal text-muted-foreground backdrop-blur-sm hover:text-foreground group-hover:block',
                    'rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  )}
                >
                  <span className="px-2">только</span>
                </button>
              </Label>
            </div>
          );
          })
        ) : (
          <div className="px-2 py-4 text-center text-sm text-muted-foreground">
            Нет доступных опций
          </div>
        )}
      </div>
    </div>
  );
}

