/**
 * @file: UsersPageActions.styles.ts
 * @description: Стили для колонки действий в таблице пользователей через CVA
 * @created: 2025-01-XX
 */

import { cva } from 'class-variance-authority';

export const cvaActionsCell = cva([
  'users-page-actions-cvaActionsCell',
  'flex justify-center',
]);

export const cvaActionsHeader = cva([
  'users-page-actions-cvaActionsHeader',
  'text-center',
]);
