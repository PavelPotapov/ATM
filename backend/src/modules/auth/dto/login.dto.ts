/**
 * @file: login.dto.ts
 * @description: DTO для входа в систему
 * @dependencies: class-validator
 * @created: 2025-12-07
 */

/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * LoginDto - данные для входа в систему
 */
export class LoginDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'admin@test.com',
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
}
