/**
 * @file: current-user.decorator.ts
 * @description: Декоратор для получения текущего аутентифицированного пользователя
 * @dependencies: @nestjs/common
 * @created: 2025-12-07
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from '../../users/types/user.types';

/**
 * @CurrentUser() - декоратор для получения текущего пользователя
 *
 * Использование:
 * @Get('profile')
 * getProfile(@CurrentUser() user: AuthenticatedUser) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest<{ user: AuthenticatedUser }>();
    return request.user; // Пользователь добавляется JwtStrategy после проверки токена
  },
);

