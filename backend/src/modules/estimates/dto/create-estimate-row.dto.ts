/**
 * @file: create-estimate-row.dto.ts
 * @description: DTO для создания строки сметы
 * @dependencies: class-validator
 * @created: 2025-01-04
 */

import { IsString, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * CreateEstimateRowDto - данные для создания новой строки сметы
 */
export class CreateEstimateRowDto {
  @ApiProperty({
    description: 'ID сметы',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString({ message: 'ID сметы должен быть строкой' })
  estimateId!: string;

  @ApiProperty({
    description: 'Порядок отображения строки',
    example: 1,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'Порядок должен быть целым числом' })
  @Min(0, { message: 'Порядок не может быть отрицательным' })
  order?: number;
}

