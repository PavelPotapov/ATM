/**
 * @file: estimate-column.types.ts
 * @description: Типы для столбцов сметы с дополнительной информацией
 * @dependencies: @prisma/client
 * @created: 2025-01-04
 */

import { ColumnDataType } from '@prisma/client';

/**
 * EstimateColumnWithCreator - столбец с информацией о создателе
 */
export interface EstimateColumnWithCreator {
  id: string;
  estimateId: string;
  createdById: string;
  name: string;
  dataType: ColumnDataType;
  order: number;
  required: boolean;
  allowedValues: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

/**
 * ColumnRolePermissionType - разрешение на столбец для роли
 */
export interface ColumnRolePermissionType {
  id: string;
  columnId: string;
  role: string;
  canView: boolean;
  canEdit: boolean;
  canCreate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * EstimateColumnFull - полная информация о столбце (с создателем и разрешениями)
 */
export interface EstimateColumnFull extends EstimateColumnWithCreator {
  rolePermissions: ColumnRolePermissionType[];
}

