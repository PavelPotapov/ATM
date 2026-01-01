/**
 * @file: CreateUserDialog.styles.ts
 * @description: Стили для CreateUserDialog через CVA
 * @created: 2025-01-XX
 */

import { cva } from 'class-variance-authority';

export const cvaDialogTrigger = cva([
  'create-user-dialog-cvaDialogTrigger',
]);

export const cvaFormContainer = cva([
  'create-user-dialog-cvaFormContainer',
  'space-y-4',
]);

export const cvaFormField = cva([
  'create-user-dialog-cvaFormField',
  'space-y-2',
]);

export const cvaFormLabel = cva([
  'create-user-dialog-cvaFormLabel',
]);

export const cvaFormInput = cva([
  'create-user-dialog-cvaFormInput',
]);

export const cvaFormSelect = cva([
  'create-user-dialog-cvaFormSelect',
  'w-full',
]);

export const cvaFormError = cva([
  'create-user-dialog-cvaFormError',
  'text-sm text-destructive',
]);

export const cvaFormCombobox = cva([
  'create-user-dialog-cvaFormCombobox',
  'w-full',
]);

