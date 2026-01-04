/**
 * @file: create-estimate.dto.ts
 * @description: DTO для создания сметы
 * @dependencies: class-validator
 * @created: 2025-01-04
 */

import {
  IsString,
  IsOptional,
  IsUUID,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * CreateEstimateDto - данные для создания новой сметы
 */
export class CreateEstimateDto {
  @ApiProperty({
    description: 'ID проекта (workspace)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID(4, { message: 'ID проекта должен быть валидным UUID' })
  workspaceId!: string;

  @ApiProperty({
    description: 'Название сметы',
    example: 'Смета на строительство офисного здания',
    minLength: 1,
    maxLength: 255,
  })
  @IsString({ message: 'Название должно быть строкой' })
  @MinLength(1, { message: 'Название не может быть пустым' })
  @MaxLength(255, { message: 'Название не может быть длиннее 255 символов' })
  name!: string;

  @ApiProperty({
    description: 'Описание сметы',
    example: 'Основная смета на строительные материалы',
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

