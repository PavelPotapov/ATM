/**
 * @file: update-cell.dto.ts
 * @description: DTO для обновления ячейки
 * @dependencies: class-validator
 * @created: 2025-01-04
 */

import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * UpdateCellDto - данные для обновления ячейки
 */
export class UpdateCellDto {
  @ApiProperty({
    description: 'Значение ячейки (строка)',
    example: '100',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Значение должно быть строкой' })
  value?: string;

  @ApiProperty({
    description: 'Причина изменения (опционально)',
    example: 'Корректировка по ТЗ',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Причина должна быть строкой' })
  reason?: string;

  @ApiProperty({
    description: 'ID строки (для создания ячейки, если её нет)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'ID строки должен быть строкой' })
  rowId?: string;

  @ApiProperty({
    description: 'ID столбца (для создания ячейки, если её нет)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'ID столбца должен быть строкой' })
  columnId?: string;
}

