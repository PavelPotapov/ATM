/**
 * @file: jwt-auth.guard.ts
 * @description: Guard для защиты endpoints с помощью JWT токенов
 * @dependencies: @nestjs/passport
 * @created: 2025-12-07
 */

import {
  Injectable,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthenticatedUser } from '../../users/types/user.types';

/**
 * JwtAuthGuard - защищает endpoints, требуя валидный JWT токен
 *
 * Использование:
 * @UseGuards(JwtAuthGuard)
 * @Get('protected')
 * getProtected() { ... }
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    this.logger.log(
      `Проверка авторизации для: ${request.method} ${request.url}`,
    );
    this.logger.log(
      `Authorization header: ${authHeader ? 'Присутствует' : 'Отсутствует'}`,
    );

    if (authHeader) {
      // Проверяем, что токен начинается с "Bearer "
      if (!authHeader.startsWith('Bearer ')) {
        this.logger.error('Токен должен начинаться с "Bearer "');
      } else {
        const token = authHeader.substring(7); // Убираем "Bearer "
        this.logger.log(`Извлеченный токен: ${token.substring(0, 20)}...`);
      }
    }

    return super.canActivate(context);
  }

  handleRequest<TUser = AuthenticatedUser>(
    err: Error | null,
    user: AuthenticatedUser | false,
    info: { message?: string } | null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _context?: ExecutionContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _status?: number,
  ): TUser {
    if (err || !user) {
      const errorMessage =
        err?.message || info?.message || 'Требуется аутентификация';
      this.logger.error(`Ошибка аутентификации: ${errorMessage}`);

      // Если это уже UnauthorizedException, пробрасываем как есть
      if (err instanceof UnauthorizedException) {
        throw err;
      }

      // Иначе создаем новый UnauthorizedException с правильным HTTP статусом
      throw new UnauthorizedException(errorMessage);
    }

    this.logger.log(`Аутентификация успешна для пользователя: ${user.email}`);
    return user as TUser;
  }
}
