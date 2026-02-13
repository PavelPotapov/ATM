/**
 * @file: auth-response.dto.ts
 * @description: DTO для ответа аутентификации (для Swagger)
 * @created: 2025-12-07
 */

import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description:
      'JWT access token для доступа к защищенным endpoints (действителен 15 минут)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token!: string;

  // refresh_token передаётся через httpOnly cookie, не в JSON

  @ApiProperty({
    description: 'Данные пользователя',
    type: 'object',
    properties: {
      id: { type: 'string', example: '53191c61-a5d5-4553-8d93-93d2cb4af828' },
      email: { type: 'string', example: 'admin@test.com' },
      firstName: { type: 'string', nullable: true, example: 'Иван' },
      lastName: { type: 'string', nullable: true, example: 'Иванов' },
      role: {
        type: 'string',
        enum: ['ADMIN', 'MANAGER', 'WORKER'],
        example: 'ADMIN',
      },
    },
  })
  user!: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
  };
}

export class RefreshResponseDto {
  @ApiProperty({
    description: 'Новый JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token!: string;
}
