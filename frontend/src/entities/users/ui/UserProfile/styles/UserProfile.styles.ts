/**
 * @file: UserProfile.styles.ts
 * @description: Стили для UserProfile через CVA
 * @created: 2025-01-XX
 */

import { cva } from 'class-variance-authority';

export const cvaDisplayName = cva([
  'user-profile-cvaDisplayName',
  'truncate',
]);

export const cvaChevron = cva([
  'user-profile-cvaChevron',
  'ml-auto group-data-[collapsible=icon]:hidden',
]);

export const cvaDropdownContent = cva([
  'user-profile-cvaDropdownContent',
  'w-[--radix-dropdown-menu-trigger-width]',
]);

export const cvaUserInfo = cva([
  'user-profile-cvaUserInfo',
  'px-2 py-1.5 text-sm',
]);

export const cvaUserName = cva([
  'user-profile-cvaUserName',
  'font-medium',
]);

export const cvaUserEmail = cva([
  'user-profile-cvaUserEmail',
  'text-muted-foreground text-xs',
]);

export const cvaUserRole = cva([
  'user-profile-cvaUserRole',
  'text-muted-foreground text-xs mt-1',
]);

