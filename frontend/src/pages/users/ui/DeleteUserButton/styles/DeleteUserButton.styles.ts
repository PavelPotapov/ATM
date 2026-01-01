/**
 * @file: DeleteUserButton.styles.ts
 * @description: Стили для DeleteUserButton через CVA
 * @created: 2025-01-XX
 */

import { cva } from 'class-variance-authority';

export const cvaDeleteButton = cva([
  'delete-user-button-cvaDeleteButton',
  'h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10',
]);

export const cvaDeleteIcon = cva([
  'delete-user-button-cvaDeleteIcon',
  'h-4 w-4',
]);

export const cvaActionsCell = cva([
  'delete-user-button-cvaActionsCell',
  'w-20',
]);
