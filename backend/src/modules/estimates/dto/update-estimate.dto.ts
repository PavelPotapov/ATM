/**
 * @file: update-estimate.dto.ts
 * @description: DTO для обновления сметы
 * @dependencies: class-validator, @nestjs/mapped-types
 * @created: 2025-01-04
 */

import { PartialType } from '@nestjs/mapped-types';
import { CreateEstimateDto } from './create-estimate.dto';
import { ApiProperty } from '@nestjs/swagger';

/**
 * UpdateEstimateDto - данные для обновления сметы
 * Все поля опциональны (наследуется от CreateEstimateDto через PartialType)
 */
export class UpdateEstimateDto extends PartialType(CreateEstimateDto) {
  @ApiProperty({
    description: 'Название сметы',
    example: 'Обновленное название сметы',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Описание сметы',
    example: 'Обновленное описание',
    required: false,
  })
  description?: string;
}

