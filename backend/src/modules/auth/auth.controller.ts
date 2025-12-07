/**
 * @file: auth.controller.ts
 * @description: Контроллер для аутентификации
 * @dependencies: AuthService
 * @created: 2025-12-07
 */

import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { AuthService, AuthResponse } from './auth.service';
import { LoginDto } from './dto/login.dto';

/**
 * AuthController - контроллер для аутентификации
 *
 * @Controller('auth') - базовый путь: /auth
 */
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/login
   * Вход в систему
   *
   * @param loginDto - email и password
   * @returns JWT токен и данные пользователя
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    this.logger.log(`Попытка входа: ${loginDto.email}`);
    const result = await this.authService.login(loginDto);
    this.logger.log(
      `Успешный вход: ${loginDto.email}, токен: ${result.access_token.substring(0, 20)}...`,
    );
    return result;
  }
}
