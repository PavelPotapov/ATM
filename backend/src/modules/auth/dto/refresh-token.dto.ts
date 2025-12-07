/**
 * @file: refresh-token.dto.ts
 * @description: DTO для обновления токена
 * @dependencies: class-validator
 * @created: 2025-12-07
 */

import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * RefreshTokenDto - данные для обновления access token
 */
export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token для получения нового access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString({ message: 'Refresh token должен быть строкой' })
  refresh_token!: string;
}
