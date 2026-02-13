/**
 * @file: filter-fns.ts
 * @description: Кастомные функции фильтрации для TanStack Table
 * @dependencies: @tanstack/react-table, date-fns, isArrayOfDates
 * @created: 2025-01-04
 */

import type { FilterFn } from '@tanstack/react-table';
import { isAfter, isBefore, isSameDay } from 'date-fns';
import { isArrayOfDates } from '@/shared/lib/is-array';

/**
 * Функция фильтрации для диапазона дат
 * Проверяет, попадает ли дата в указанный диапазон
 */
export const inDateRange: FilterFn<unknown> = (row, columnId, value) => {
  const cellValue = row.getValue(columnId);
  
  // Если значение ячейки - строка, пытаемся преобразовать в Date
  let date: Date;
  if (cellValue instanceof Date) {
    date = cellValue;
  } else if (typeof cellValue === 'string') {
    date = new Date(cellValue);
  } else {
    return false;
  }

  if (Number.isNaN(date.getTime())) return false;

  // Если value - массив дат [start, end]
  if (Array.isArray(value) && isArrayOfDates(value)) {
    const [start, end] = value;

    // Если нет конечной даты, проверяем, что это тот же день
    if (!end) {
      return isSameDay(date, start);
    }

    // Проверяем, что дата попадает в диапазон
    return (isAfter(date, start) || isSameDay(date, start)) && 
           (isBefore(date, end) || isSameDay(date, end));
  }

  // Если value - одна дата
  if (value instanceof Date) {
    return isSameDay(date, value);
  }

  return false;
};

inDateRange.autoRemove = (val: unknown) =>
  !Array.isArray(val) || !val.length || !isArrayOfDates(val);

/**
 * Функция фильтрации для массивов значений
 * Проверяет, содержит ли массив значение ячейки
 */
export const arrSome: FilterFn<unknown> = (row, columnId, filterValue) => {
  if (!Array.isArray(filterValue)) return false;
  const cellValue = row.getValue(columnId);
  return filterValue.some((val) => {
    if (Array.isArray(cellValue)) {
      return cellValue.includes(val);
    }
    return String(cellValue) === String(val);
  });
};

arrSome.autoRemove = (val: unknown) => !Array.isArray(val) || !val?.length;




