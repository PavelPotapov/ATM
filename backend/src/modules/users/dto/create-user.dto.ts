/**
 * @file: create-user.dto.ts
 * @description: DTO (Data Transfer Object) для создания пользователя. Валидация входящих данных
 * @dependencies: class-validator
 * @created: 2025-12-07
 */

import {
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

/**
 * CreateUserDto - данные для создания нового пользователя
 *
 * DTO используется для:
 * 1. Валидации данных от клиента
 * 2. Типизации (TypeScript знает структуру данных)
 * 3. Документации API (Swagger может использовать DTO)
 */
export class CreateUserDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Email должен быть валидным' })
  email!: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'Пароль должен быть минимум 6 символов' })
  password!: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Иванов',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'Роль пользователя',
    enum: Role,
    example: Role.WORKER,
    required: false,
  })
  @IsOptional()
  @IsEnum(Role, { message: 'Роль должна быть ADMIN, MANAGER или WORKER' })
  role?: Role;
}
