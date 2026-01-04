/**
 * @file: format.ts
 * @description: Утилиты для форматирования чисел и дат
 * @created: 2025-01-04
 */

/**
 * Форматирует число в компактный вид (1k, 1M)
 * @param value - число для форматирования
 * @returns отформатированная строка
 */
export function formatCompactNumber(value: number): string {
  if (value >= 100 && value < 1000) {
    return value.toString();
  } else if (value >= 1000 && value < 1000000) {
    return (value / 1000).toFixed(1) + 'k';
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M';
  }
  return value.toString();
}

