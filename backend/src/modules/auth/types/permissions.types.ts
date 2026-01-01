/**
 * @file: permissions.types.ts
 * @description: Типы и константы для системы разрешений (permissions)
 * @created: 2025-01-XX
 */

/**
 * Сущности в системе
 */
export enum PermissionEntity {
  WORKSPACES = 'workspaces',
  USERS = 'users',
}

/**
 * Действия над сущностями
 */
export enum PermissionAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  DELETE_PERMANENT = 'deletePermanent',
  RESTORE = 'restore',
  ADD_USER = 'addUser',
  REMOVE_USER = 'removeUser',
  VIEW_HISTORY = 'viewHistory',
  VIEW = 'view',
}

/**
 * Составной тип разрешения: {сущность}.{действие}
 * Пример: 'workspaces.create', 'users.view'
 */
export type Permission = `${PermissionEntity}.${PermissionAction}`;

/**
 * Константы разрешений для типобезопасности
 */
export const PERMISSIONS = {
  // Workspaces
  WORKSPACES_CREATE: 'workspaces.create' as Permission,
  WORKSPACES_UPDATE: 'workspaces.update' as Permission,
  WORKSPACES_DELETE: 'workspaces.delete' as Permission,
  WORKSPACES_DELETE_PERMANENT: 'workspaces.deletePermanent' as Permission,
  WORKSPACES_RESTORE: 'workspaces.restore' as Permission,
  WORKSPACES_ADD_USER: 'workspaces.addUser' as Permission,
  WORKSPACES_REMOVE_USER: 'workspaces.removeUser' as Permission,
  WORKSPACES_VIEW_HISTORY: 'workspaces.viewHistory' as Permission,

  // Users
  USERS_CREATE: 'users.create' as Permission,
  USERS_UPDATE: 'users.update' as Permission,
  USERS_DELETE: 'users.delete' as Permission,
  USERS_VIEW: 'users.view' as Permission,
} as const;

/**
 * Тип для списка разрешений
 */
export type PermissionsList = Permission[];
