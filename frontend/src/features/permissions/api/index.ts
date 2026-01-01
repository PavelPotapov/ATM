/**
 * @file: index.ts
 * @description: Публичный API модуля permissions
 * @created: 2025-01-XX
 */

// Экспорт типов
export type { Permission, PermissionEntity, PermissionAction } from '../types/permissions.types';
export type { PermissionsResponse } from './queries/getPermissions';

// Экспорт констант
export { PERMISSIONS } from '../types/permissions.types';

// Экспорт query keys
export { permissionsKeys } from './queryKeys';

// Экспорт queries (опционально, если нужны напрямую)
export { getPermissions } from './queries/getPermissions';

// Экспорт hooks (основной способ использования)
export { usePermissions, useHasPermission } from './hooks/usePermissions';
