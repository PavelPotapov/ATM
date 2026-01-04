/**
 * @file: date-preset.ts
 * @description: Константы для предустановленных диапазонов дат
 * @dependencies: date-fns
 * @created: 2025-01-04
 */

import { addDays, addHours, endOfDay, startOfDay } from 'date-fns';
import type { DatePreset } from '@/widgets/table/types';

export const presets: DatePreset[] = [
  {
    label: 'Сегодня',
    from: startOfDay(new Date()),
    to: endOfDay(new Date()),
    shortcut: 'd', // day
  },
  {
    label: 'Вчера',
    from: startOfDay(addDays(new Date(), -1)),
    to: endOfDay(addDays(new Date(), -1)),
    shortcut: 'y',
  },
  {
    label: 'Последний час',
    from: addHours(new Date(), -1),
    to: new Date(),
    shortcut: 'h',
  },
  {
    label: 'Последние 7 дней',
    from: startOfDay(addDays(new Date(), -7)),
    to: endOfDay(new Date()),
    shortcut: 'w',
  },
  {
    label: 'Последние 14 дней',
    from: startOfDay(addDays(new Date(), -14)),
    to: endOfDay(new Date()),
    shortcut: 'b', // bi-weekly
  },
  {
    label: 'Последние 30 дней',
    from: startOfDay(addDays(new Date(), -30)),
    to: endOfDay(new Date()),
    shortcut: 'm',
  },
];

