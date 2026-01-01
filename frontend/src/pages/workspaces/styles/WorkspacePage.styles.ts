/**
 * @file: WorkspacePage.styles.ts
 * @description: Стили для WorkspacePage через CVA
 * @created: 2025-01-XX
 */

import { cva } from 'class-variance-authority';

export const cvaContainer = cva([
  'workspace-page-cvaContainer',
  'container mx-auto py-8',
]);

export const cvaHeaderContainer = cva([
  'workspace-page-cvaHeaderContainer',
  'mb-6',
]);

export const cvaTitle = cva([
  'workspace-page-cvaTitle',
  'text-3xl font-bold',
]);

export const cvaDescription = cva([
  'workspace-page-cvaDescription',
  'text-muted-foreground mt-2',
]);

export const cvaGrid = cva([
  'workspace-page-cvaGrid',
  'grid gap-4 md:grid-cols-2',
]);

export const cvaInfoContainer = cva([
  'workspace-page-cvaInfoContainer',
  'space-y-2 text-sm',
]);

export const cvaInfoLabel = cva([
  'workspace-page-cvaInfoLabel',
  'font-medium',
]);

export const cvaInfoValue = cva([
  'workspace-page-cvaInfoValue',
  'text-muted-foreground',
]);

export const cvaErrorCard = cva([
  'workspace-page-cvaErrorCard',
  'w-full max-w-md mx-auto',
]);

export const cvaNotFoundText = cva([
  'workspace-page-cvaNotFoundText',
  'text-center text-muted-foreground',
]);

export const cvaSkeletonContainer = cva([
  'workspace-page-cvaSkeletonContainer',
  'mb-6',
]);

