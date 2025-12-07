/**
 * @file: jwt.strategy.ts
 * @description: JWT стратегия для Passport - проверка JWT токенов
 * @dependencies: @nestjs/passport, passport-jwt
 * @created: 2025-12-07
 */

import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../common/prisma.service';
import { JwtPayload } from '../auth.service';
import { AuthenticatedUser } from '../../users/types/user.types';

/**
 * JwtStrategy - стратегия для проверки JWT токенов
 *
 * Passport автоматически извлекает токен из заголовка Authorization
 * и проверяет его валидность
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private prisma: PrismaService) {
    const secret =
      process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    super({
      // Извлекаем токен из заголовка Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Секретный ключ для проверки подписи токена
      secretOrKey: secret,
      // Игнорируем срок действия токена (можно настроить позже)
      ignoreExpiration: false,
    });
    this.logger.log('JWT Strategy инициализирована');
    this.logger.log(
      `JWT_SECRET установлен: ${process.env.JWT_SECRET ? 'Да' : 'Нет'}`,
    );
    this.logger.log(`JWT_SECRET значение (полное): ${secret}`);
    this.logger.log(`JWT_SECRET длина: ${secret.length} символов`);
  }

  /**
   * Вызывается после успешной проверки токена
   * Возвращает данные пользователя, которые будут доступны через @CurrentUser()
   */
  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    this.logger.log(
      `Валидация токена для пользователя: ${payload.email} (ID: ${payload.sub})`,
    );

    // Проверяем, существует ли пользователь
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    if (!user) {
      this.logger.warn(`Пользователь не найден: ${payload.sub}`);
      throw new UnauthorizedException('Пользователь не найден');
    }

    this.logger.log(`Пользователь успешно валидирован: ${user.email}`);
    return user;
  }
}
