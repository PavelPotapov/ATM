/**
 * @file: create-estimate-column.dto.ts
 * @description: DTO для создания столбца сметы
 * @dependencies: class-validator
 * @created: 2025-01-04
 */

import {
  IsString,
  IsEnum,
  IsInt,
  IsBoolean,
  IsOptional,
  IsArray,
  Min,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ColumnDataType } from '@prisma/client';

/**
 * CreateEstimateColumnDto - данные для создания нового столбца сметы
 */
export class CreateEstimateColumnDto {
  @ApiProperty({
    description: 'ID сметы',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString({ message: 'ID сметы должен быть строкой' })
  estimateId!: string;

  @ApiProperty({
    description: 'Название столбца',
    example: 'п/п',
    minLength: 1,
    maxLength: 255,
  })
  @IsString({ message: 'Название столбца должно быть строкой' })
  @MinLength(1, { message: 'Название столбца не может быть пустым' })
  @MaxLength(255, {
    message: 'Название столбца не может быть длиннее 255 символов',
  })
  name!: string;

  @ApiProperty({
    description: 'Тип данных столбца',
    enum: ColumnDataType,
    example: ColumnDataType.STRING,
    default: ColumnDataType.STRING,
  })
  @IsEnum(ColumnDataType, {
    message: 'Тип данных должен быть одним из: STRING, NUMBER, ENUM, BOOLEAN, DATE',
  })
  dataType: ColumnDataType = ColumnDataType.STRING;

  @ApiProperty({
    description: 'Порядок отображения столбца',
    example: 1,
    minimum: 0,
  })
  @IsInt({ message: 'Порядок должен быть целым числом' })
  @Min(0, { message: 'Порядок не может быть отрицательным' })
  order!: number;

  @ApiProperty({
    description: 'Обязательное ли поле',
    example: false,
    default: false,
  })
  @IsBoolean({ message: 'Обязательность должна быть булевым значением' })
  required: boolean = false;

  @ApiProperty({
    description:
      'Разрешенные значения для ENUM типа (JSON массив строк)',
    example: ['м', 'м2', 'шт', 'л'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'Разрешенные значения должны быть массивом' })
  @IsString({ each: true, message: 'Каждое значение должно быть строкой' })
  allowedValues?: string[];
}

