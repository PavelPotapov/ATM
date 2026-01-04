/**
 * @file: estimate-column-full.dto.ts
 * @description: DTO для полной информации о столбце
 * @created: 2025-01-04
 */

import type { EstimateColumnDto } from './estimate.dto';
import type { ColumnRolePermissionDto } from './column-permission.dto';

/**
 * DTO для полной информации о столбце (с создателем и разрешениями)
 */
export interface EstimateColumnFullDto extends EstimateColumnDto {
  createdBy: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
  rolePermissions: ColumnRolePermissionDto[];
}

