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
  Req,
  Res,
  HttpCode,
  HttpStatus,
  Logger,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import type { AuthResponse, RefreshResponse } from './auth.service';
import { PermissionsService } from './services/permissions.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, RefreshResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthenticatedUser } from '../users/types/user.types';
import { PermissionsList } from './types/permissions.types';

const REFRESH_TOKEN_COOKIE = 'refresh_token';
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 дней

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
   * Устанавливает refresh token в httpOnly cookie
   */
  private setRefreshTokenCookie(res: Response, token: string): void {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie(REFRESH_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/api/v1/auth',
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
  }

  /**
   * Очищает refresh token cookie
   */
  private clearRefreshTokenCookie(res: Response): void {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie(REFRESH_TOKEN_COOKIE, '', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/api/v1/auth',
      maxAge: 0,
    });
  }

  /**
   * POST /auth/login
   * Вход в систему
   *
   * @param loginDto - email и password
   * @returns JWT access token и данные пользователя. Refresh token устанавливается в httpOnly cookie.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Вход в систему',
    description:
      'Аутентификация пользователя. Access token возвращается в JSON, refresh token — в httpOnly cookie.',
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
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthResponse> {
    this.logger.log(`Попытка входа: ${loginDto.email}`);
    const result = await this.authService.login(loginDto);

    // Устанавливаем refresh token в httpOnly cookie
    this.setRefreshTokenCookie(res, result.refresh_token);

    this.logger.log(`Успешный вход: ${loginDto.email}`);

    // Возвращаем только access_token и user (без refresh_token в JSON)
    return {
      access_token: result.access_token,
      user: result.user,
    };
  }

  /**
   * POST /auth/refresh
   * Обновление access token с помощью refresh token
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Обновление токена',
    description:
      'Получение нового access token. Refresh token читается из httpOnly cookie.',
  })
  @ApiResponse({
    status: 200,
    description: 'Новый access token успешно получен',
    type: RefreshResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Невалидный или истекший refresh token',
  })
  async refresh(@Req() req: Request): Promise<RefreshResponse> {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token не найден');
    }

    this.logger.log('Попытка обновления токена');
    return this.authService.refresh(refreshToken);
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
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    this.logger.log(`Выход пользователя: ${user.email}`);
    await this.authService.logout(user.id);
    this.clearRefreshTokenCookie(res);
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
  getPermissions(@CurrentUser() user: AuthenticatedUser): {
    permissions: PermissionsList;
  } {
    this.logger.log(`Получение разрешений для пользователя: ${user.email}`);
    const permissions = this.permissionsService.getPermissionsByRole(user.role);
    return { permissions };
  }
}
