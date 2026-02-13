/**
 * @file: auth.service.ts
 * @description: Сервис для аутентификации пользователей
 * @dependencies: UsersService, JwtService, password.util
 * @created: 2025-12-07
 */

import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../../common/prisma.service';
import { comparePassword } from '../../common/utils/password.util';
import { LoginDto } from './dto/login.dto';
import { AuthenticatedUser } from '../users/types/user.types';

/**
 * Интерфейс для payload JWT токена
 */
export interface JwtPayload {
  sub: string; // ID пользователя
  email: string;
  role: string;
}

/**
 * Интерфейс для ответа при успешной аутентификации
 * refresh_token не включается в JSON-ответ — передаётся через httpOnly cookie
 */
export interface AuthResponse {
  access_token: string;
  user: AuthenticatedUser;
}

/**
 * Полный результат логина (для внутреннего использования в контроллере)
 */
export interface LoginResult {
  access_token: string;
  refresh_token: string;
  user: AuthenticatedUser;
}

/**
 * Интерфейс для ответа при обновлении токена
 */
export interface RefreshResponse {
  access_token: string;
}

/**
 * AuthService - сервис для аутентификации
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {
    this.logger.log('AuthService инициализирован');
  }

  /**
   * Валидация пользователя по email и паролю
   * Используется в JWT стратегии
   */
  async validateUser(
    email: string,
    password: string,
  ): Promise<AuthenticatedUser | null> {
    // Находим пользователя по email
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    // Сравниваем пароль с хэшем
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    // Возвращаем пользователя без пароля
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };
  }

  /**
   * Вход в систему - проверяет credentials и возвращает JWT токен
   */
  async login(loginDto: LoginDto): Promise<LoginResult> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    // Создаем payload для JWT токена
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    this.logger.log(`Создание токена для пользователя: ${user.email}`);
    this.logger.log(`Payload: ${JSON.stringify(payload)}`);

    // Генерируем access token (короткоживущий - 15 минут)
    const access_token = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });

    // Генерируем refresh token (долгоживущий - 7 дней)
    const refresh_token = this.jwtService.sign(
      { sub: user.id },
      {
        expiresIn: '7d',
      },
    );

    // Сохраняем refresh token в БД
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: refresh_token },
    });

    this.logger.log(`Токены созданы для пользователя: ${user.email}`);

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  /**
   * Обновление access token с помощью refresh token
   * @param refreshToken - refresh token
   * @returns новый access token
   */
  async refresh(refreshToken: string): Promise<RefreshResponse> {
    try {
      // Проверяем валидность refresh token
      // verify возвращает payload с полем sub (ID пользователя)
      const payload = this.jwtService.verify<{ sub: string }>(refreshToken);

      // Проверяем, что токен есть в БД и принадлежит пользователю
      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.sub,
        },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Невалидный refresh token');
      }

      // Создаем новый access token
      const newPayload: JwtPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const access_token = this.jwtService.sign(newPayload, {
        expiresIn: '15m',
      });

      this.logger.log(`Токен обновлен для пользователя: ${user.email}`);

      return {
        access_token,
      };
    } catch (error) {
      this.logger.error(`Ошибка обновления токена: ${error}`);
      throw new UnauthorizedException('Невалидный или истекший refresh token');
    }
  }

  /**
   * Выход из системы - удаляет refresh token
   * @param userId - ID пользователя
   */
  async logout(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    this.logger.log(`Пользователь ${userId} вышел из системы`);
  }
}
