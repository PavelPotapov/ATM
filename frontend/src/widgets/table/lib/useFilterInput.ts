/**
 * @file: useFilterInput.ts
 * @description: Хук для управления состоянием input фильтра с debounce и синхронизацией
 * @dependencies: useDebounce
 * @created: 2025-01-04
 */

import { useEffect, useRef, useState } from 'react';
import { useDebounce } from '@/shared/hooks';

interface UseFilterInputOptions {
  /** Текущее значение фильтра из таблицы */
  filterValue: string | null | undefined;
  /** Debounce задержка в миллисекундах (по умолчанию 500) */
  debounceDelay?: number;
  /** Callback для применения значения к фильтру */
  onApply: (value: string | undefined) => void;
}

/**
 * Хук для управления состоянием input фильтра
 * Упрощенная версия без сложной логики синхронизации
 */
export function useFilterInput({
  filterValue,
  debounceDelay = 500,
  onApply,
}: UseFilterInputOptions) {
  const filters = filterValue ?? null;
  const [input, setInput] = useState<string | null>(filters);
  const debouncedInput = useDebounce(input, debounceDelay);
  
  // Ref для отслеживания последнего примененного значения
  const lastAppliedRef = useRef<string | null | undefined>(filters);
  // Флаг для блокировки синхронизации сразу после применения
  const justAppliedRef = useRef(false);

  // Применяем debounced значение к фильтру
  useEffect(() => {
    // Пустая строка = undefined (сброс фильтра)
    const newValue = debouncedInput?.trim() === '' ? undefined : debouncedInput ?? undefined;
    
    // Если debouncedInput null - ничего не делаем
    if (debouncedInput === null) return;
    
    // Нормализуем для сравнения
    const normalizedNew = newValue?.trim() || null;
    const normalizedLast = lastAppliedRef.current?.trim() || null;
    
    // Если значение не изменилось - ничего не делаем
    if (normalizedNew === normalizedLast) return;
    
    // Помечаем, что мы применяем значение
    justAppliedRef.current = true;
    
    // Применяем значение (newValue уже нормализован как string | undefined)
    onApply(newValue);
    lastAppliedRef.current = debouncedInput;
    
    // Сбрасываем флаг через небольшую задержку
    const timer = setTimeout(() => {
      justAppliedRef.current = false;
    }, 100);
    
    return () => clearTimeout(timer);
  }, [debouncedInput, onApply]);

  // Синхронизируем input с filters только если изменение пришло извне
  // Это необходимо для синхронизации с внешними изменениями (чип, сброс фильтра)
  // Использование setState в useEffect здесь оправдано - мы синхронизируем состояние из внешнего источника
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      lastAppliedRef.current = debouncedInput;
      return;
    }
    
    // Синхронизируем только если фильтр изменился извне
    setInput(filters);
    lastAppliedRef.current = filters;
  }, [filters, debouncedInput, input]);

  return {
    input,
    setInput,
  };
}

