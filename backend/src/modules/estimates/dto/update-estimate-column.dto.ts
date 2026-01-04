/**
 * @file: update-estimate-column.dto.ts
 * @description: DTO для обновления столбца сметы
 * @dependencies: class-validator, @nestjs/mapped-types
 * @created: 2025-01-04
 */

import { PartialType } from '@nestjs/mapped-types';
import { CreateEstimateColumnDto } from './create-estimate-column.dto';
import { ApiProperty } from '@nestjs/swagger';
import { ColumnDataType } from '@prisma/client';

/**
 * UpdateEstimateColumnDto - данные для обновления столбца сметы
 * Все поля опциональны (наследуется от CreateEstimateColumnDto через PartialType)
 */
export class UpdateEstimateColumnDto extends PartialType(
  CreateEstimateColumnDto,
) {
  @ApiProperty({
    description: 'Название столбца',
    example: 'Обновленное название',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Тип данных столбца',
    enum: ColumnDataType,
    example: ColumnDataType.STRING,
    required: false,
  })
  dataType?: ColumnDataType;

  @ApiProperty({
    description: 'Порядок отображения столбца',
    example: 2,
    required: false,
  })
  order?: number;

  @ApiProperty({
    description: 'Обязательное ли поле',
    example: true,
    required: false,
  })
  required?: boolean;

  @ApiProperty({
    description: 'Разрешенные значения для ENUM типа',
    example: ['м', 'м2'],
    required: false,
  })
  allowedValues?: string[];
}

