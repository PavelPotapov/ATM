/**
 * @file: AuthenticatedLayout.styles.ts
 * @description: Стили для AuthenticatedLayout через CVA
 * @created: 2025-01-XX
 */

import { cva } from 'class-variance-authority';

export const cvaHeader = cva([
  'authenticated-layout-cvaHeader',
  'flex h-12 shrink-0 items-center justify-between gap-2 border-b px-4',
]);

export const cvaMain = cva([
  'authenticated-layout-cvaMain',
  'flex flex-1 flex-col gap-4 p-4',
]);

