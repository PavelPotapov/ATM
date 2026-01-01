/**
 * @file: permissions.ts
 * @description: Константы разрешений (permissions) - должны совпадать с бэкендом
 * @created: 2025-01-XX
 */

/**
 * Номенклатура разрешений в системе
 * Формат: {сущность}.{действие}
 * Должны совпадать с backend/src/modules/auth/types/permissions.types.ts
 */
export const PERMISSIONS = {
  // Workspaces
  WORKSPACES_CREATE: 'workspaces.create',
  WORKSPACES_UPDATE: 'workspaces.update',
  WORKSPACES_DELETE: 'workspaces.delete',
  WORKSPACES_DELETE_PERMANENT: 'workspaces.deletePermanent',
  WORKSPACES_RESTORE: 'workspaces.restore',
  WORKSPACES_ADD_USER: 'workspaces.addUser',
  WORKSPACES_REMOVE_USER: 'workspaces.removeUser',
  WORKSPACES_VIEW_HISTORY: 'workspaces.viewHistory',

  // Users (только для ADMIN)
  USERS_CREATE: 'users.create',
  USERS_UPDATE: 'users.update',
  USERS_DELETE: 'users.delete',
  USERS_VIEW: 'users.view',
} as const;

/**
 * Тип для значения разрешения
 */
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

