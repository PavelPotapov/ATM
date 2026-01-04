/**
 * @file: column-permission.dto.ts
 * @description: DTO для разрешений на столбцы
 * @created: 2025-01-04
 */

export type Role = 'ADMIN' | 'MANAGER' | 'WORKER';

/**
 * DTO для разрешения на столбец для роли
 */
export interface ColumnRolePermissionDto {
  id: string;
  columnId: string;
  role: Role;
  canView: boolean;
  canEdit: boolean;
  canCreate: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO для создания разрешения на столбец
 */
export interface CreateColumnPermissionDto {
  columnId: string;
  role: Role;
  canView?: boolean;
  canEdit?: boolean;
  canCreate?: boolean;
}

/**
 * DTO для обновления разрешения на столбец
 */
export interface UpdateColumnPermissionDto {
  canView?: boolean;
  canEdit?: boolean;
  canCreate?: boolean;
}

