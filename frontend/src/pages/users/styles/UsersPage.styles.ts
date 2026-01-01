/**
 * @file: UsersPage.styles.ts
 * @description: Стили для UsersPage через CVA
 * @created: 2025-01-XX
 */

import { cva } from 'class-variance-authority';

export const cvaContainer = cva([
  'users-page-cvaContainer',
  'container mx-auto py-8',
]);

export const cvaHeaderContainer = cva([
  'users-page-cvaHeaderContainer',
  'mb-6 flex items-start justify-between gap-4',
]);

export const cvaHeaderActions = cva([
  'users-page-cvaHeaderActions',
  'flex items-center gap-2',
]);

export const cvaTitle = cva([
  'users-page-cvaTitle',
  'text-3xl font-bold',
]);

export const cvaDescription = cva([
  'users-page-cvaDescription',
  'text-muted-foreground mt-2',
]);

export const cvaErrorDescription = cva([
  'users-page-cvaErrorDescription',
  'text-muted-foreground mt-2 text-destructive',
]);

