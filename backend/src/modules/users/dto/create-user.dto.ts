/**
 * @file: create-user.dto.ts
 * @description: DTO (Data Transfer Object) для создания пользователя. Валидация входящих данных
 * @dependencies: class-validator
 * @created: 2025-12-07
 */

/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsEmail,
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';
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
  @IsEmail({}, { message: 'Email должен быть валидным' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Пароль должен быть минимум 6 символов' })
  password!: string;

  @IsOptional() // Поле необязательное
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEnum(Role, { message: 'Роль должна быть ADMIN, MANAGER или WORKER' })
  role?: Role;
}
