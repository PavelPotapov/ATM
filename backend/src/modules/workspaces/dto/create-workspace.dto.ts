/**
 * @file: create-workspace.dto.ts
 * @description: DTO для создания рабочего пространства
 * @dependencies: class-validator
 * @created: 2025-12-07
 */

import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * CreateWorkspaceDto - данные для создания нового workspace
 */
export class CreateWorkspaceDto {
  @ApiProperty({
    description: 'Название рабочего пространства',
    example: 'Проект строительства офисного здания',
    minLength: 1,
    maxLength: 255,
  })
  @IsString({ message: 'Название должно быть строкой' })
  @MinLength(1, { message: 'Название не может быть пустым' })
  @MaxLength(255, { message: 'Название не может быть длиннее 255 символов' })
  name!: string;

  @ApiProperty({
    description: 'Описание рабочего пространства',
    example: 'Строительство 5-этажного офисного здания в центре города',
    required: false,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString({ message: 'Описание должно быть строкой' })
  @MaxLength(1000, {
    message: 'Описание не может быть длиннее 1000 символов',
  })
  description?: string;
}
