/**
 * @file: auth.controller.ts
 * @description: Контроллер для аутентификации
 * @dependencies: AuthService
 * @created: 2025-12-07
 */

import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Logger,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService, AuthResponse, RefreshResponse } from './auth.service';
import { PermissionsService } from './services/permissions.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthResponseDto, RefreshResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthenticatedUser } from '../users/types/user.types';
import { PermissionsList } from './types/permissions.types';

/**
 * AuthController - контроллер для аутентификации
 *
 * @Controller('auth') - базовый путь: /auth
 */
@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly permissionsService: PermissionsService,
  ) {}

  /**
   * POST /auth/login
   * Вход в систему
   *
   * @param loginDto - email и password
   * @returns JWT токен и данные пользователя
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Вход в систему',
    description: 'Аутентификация пользователя и получение JWT токена',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Успешная аутентификация',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Неверный email или пароль',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    this.logger.log(`Попытка входа: ${loginDto.email}`);
    const result = await this.authService.login(loginDto);
    this.logger.log(
      `Успешный вход: ${loginDto.email}, токен: ${result.access_token.substring(0, 20)}...`,
    );
    return result;
  }

  /**
   * POST /auth/refresh
   * Обновление access token с помощью refresh token
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Обновление токена',
    description: 'Получение нового access token с помощью refresh token',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Новый access token успешно получен',
    type: RefreshResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Невалидный или истекший refresh token',
  })
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<RefreshResponse> {
    this.logger.log('Попытка обновления токена');
    return this.authService.refresh(refreshTokenDto.refresh_token);
  }

  /**
   * GET /auth/me
   * Получение информации о текущем пользователе
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Получение текущего пользователя',
    description:
      'Возвращает информацию о текущем аутентифицированном пользователе',
  })
  @ApiResponse({
    status: 200,
    description: 'Данные текущего пользователя',
  })
  @ApiResponse({
    status: 401,
    description: 'Требуется аутентификация',
  })
  getMe(@CurrentUser() user: AuthenticatedUser): AuthenticatedUser {
    this.logger.log(`Получение данных пользователя: ${user.email}`);
    return user;
  }

  /**
   * POST /auth/logout
   * Выход из системы
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Выход из системы',
    description: 'Выход из системы и удаление refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'Успешный выход из системы',
  })
  @ApiResponse({
    status: 401,
    description: 'Требуется аутентификация',
  })
  async logout(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<{ message: string }> {
    this.logger.log(`Выход пользователя: ${user.email}`);
    await this.authService.logout(user.id);
    return { message: 'Успешный выход из системы' };
  }

  /**
   * GET /auth/permissions
   * Получение списка разрешений текущего пользователя
   */
  @Get('permissions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Получение разрешений пользователя',
    description:
      'Возвращает список разрешений (permissions) для текущего пользователя на основе его роли',
  })
  @ApiResponse({
    status: 200,
    description: 'Список разрешений пользователя',
    schema: {
      type: 'object',
      properties: {
        permissions: {
          type: 'array',
          items: {
            type: 'string',
            example: 'workspaces.create',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Требуется аутентификация',
  })
  getPermissions(
    @CurrentUser() user: AuthenticatedUser,
  ): { permissions: PermissionsList } {
    this.logger.log(`Получение разрешений для пользователя: ${user.email}`);
    const permissions = this.permissionsService.getPermissionsByRole(user.role);
    return { permissions };
  }
}
