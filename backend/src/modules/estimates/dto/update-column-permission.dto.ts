/**
 * @file: update-column-permission.dto.ts
 * @description: DTO для обновления разрешения на столбец для роли
 * @dependencies: class-validator, @nestjs/mapped-types
 * @created: 2025-01-04
 */

import { PartialType } from '@nestjs/mapped-types';
import { CreateColumnPermissionDto } from './create-column-permission.dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * UpdateColumnPermissionDto - данные для обновления разрешения на столбец
 * Все поля опциональны (наследуется от CreateColumnPermissionDto через PartialType)
 */
export class UpdateColumnPermissionDto extends PartialType(
  CreateColumnPermissionDto,
) {
  @ApiProperty({
    description: 'Может ли роль видеть столбец',
    example: true,
    required: false,
  })
  canView?: boolean;

  @ApiProperty({
    description: 'Может ли роль редактировать столбец',
    example: true,
    required: false,
  })
  canEdit?: boolean;

  @ApiProperty({
    description: 'Может ли роль создавать столбцы',
    example: false,
    required: false,
  })
  canCreate?: boolean;
}

