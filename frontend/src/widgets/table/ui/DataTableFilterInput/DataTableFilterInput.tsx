/**
 * @file: DataTableFilterInput.tsx
 * @description: Компонент фильтра типа input
 * @dependencies: useDataTable, InputWithAddons, useDebounce
 * @created: 2025-01-04
 */

import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Label } from '@/shared/ui/label';
import { InputWithAddons } from '@/shared/ui/input-with-addons';
import { useDebounce } from '@/shared/hooks';
import { useDataTable } from '../../lib';
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
  const [input, setInput] = useState<string | null>(filters);

  // Ref для отслеживания последнего примененного значения
  const lastAppliedRef = useRef<string | null | undefined>(filters);
  // Флаг для отслеживания, что мы только что применили значение
  const justAppliedRef = useRef(false);

  const debouncedInput = useDebounce(input, 500);

  // Применяем debounced значение к фильтру
  useEffect(() => {
    // Пустая строка = undefined (сброс фильтра)
    const newValue = debouncedInput?.trim() === '' ? undefined : debouncedInput;
    
    // Если debouncedInput null - ничего не делаем
    if (debouncedInput === null) return;
    
    // Нормализуем для сравнения
    const normalizedNew = newValue?.trim() || null;
    const normalizedLast = lastAppliedRef.current?.trim() || null;
    
    // Если значение не изменилось - ничего не делаем
    if (normalizedNew === normalizedLast) return;
    
    // Помечаем, что мы применяем значение
    justAppliedRef.current = true;
    
    // Применяем значение к фильтру
    column?.setFilterValue(newValue);
    lastAppliedRef.current = debouncedInput;
    
    // Сбрасываем флаг через небольшую задержку, чтобы синхронизация не сработала
    setTimeout(() => {
      justAppliedRef.current = false;
    }, 100);
  }, [debouncedInput, column]);

  // Синхронизируем input с filters только если изменение пришло извне
  useEffect(() => {
    // Если мы только что применили значение - не синхронизируем
    if (justAppliedRef.current) {
      return;
    }
    
    // Нормализуем для сравнения
    const normalizedFilters = filters?.trim() || null;
    const normalizedLastApplied = lastAppliedRef.current?.trim() || null;
    const normalizedDebounced = debouncedInput?.trim() || null;
    
    // Если значения совпадают - ничего не делаем
    if (normalizedFilters === normalizedLastApplied) return;
    
    // Если фильтр сброшен извне (null/undefined) - очищаем input
    if (normalizedFilters === null && normalizedLastApplied !== null) {
      setInput(null);
      lastAppliedRef.current = null;
      return;
    }
    
    // Если пользователь активно вводит (input !== debouncedInput) - не синхронизируем
    const currentInput = input?.trim() || null;
    if (currentInput !== normalizedDebounced) {
      return;
    }
    
    // Если filters совпадает с debouncedInput - это значит мы только что применили это значение
    // Не синхронизируем, чтобы избежать мигания
    if (normalizedFilters === normalizedDebounced) {
      // Обновляем lastAppliedRef, чтобы следующая проверка прошла корректно
      lastAppliedRef.current = debouncedInput;
      return;
    }
    
    // Синхронизируем только если фильтр изменился извне
    // (не от нашего debounce, так как мы уже проверили все выше)
    setInput(filters);
    lastAppliedRef.current = filters;
  }, [filters, debouncedInput, input]);

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
