/**
 * @file: create-column-permission.dto.ts
 * @description: DTO для создания разрешения на столбец для роли
 * @dependencies: class-validator
 * @created: 2025-01-04
 */

import { IsString, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

/**
 * CreateColumnPermissionDto - данные для создания разрешения на столбец
 */
export class CreateColumnPermissionDto {
  @ApiProperty({
    description: 'ID столбца',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString({ message: 'ID столбца должен быть строкой' })
  columnId!: string;

  @ApiProperty({
    description: 'Роль пользователя',
    enum: Role,
    example: Role.WORKER,
  })
  @IsEnum(Role, {
    message: 'Роль должна быть одной из: ADMIN, MANAGER, WORKER',
  })
  role!: Role;

  @ApiProperty({
    description: 'Может ли роль видеть столбец',
    example: true,
    default: true,
  })
  @IsBoolean({ message: 'canView должно быть булевым значением' })
  canView: boolean = true;

  @ApiProperty({
    description: 'Может ли роль редактировать столбец',
    example: false,
    default: false,
  })
  @IsBoolean({ message: 'canEdit должно быть булевым значением' })
  canEdit: boolean = false;

  @ApiProperty({
    description: 'Может ли роль создавать столбцы (для будущего)',
    example: false,
    default: false,
  })
  @IsBoolean({ message: 'canCreate должно быть булевым значением' })
  canCreate: boolean = false;
}

