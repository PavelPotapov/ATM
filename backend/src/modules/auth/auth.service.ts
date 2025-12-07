/**
 * @file: auth.service.ts
 * @description: Сервис для аутентификации пользователей
 * @dependencies: UsersService, JwtService, password.util
 * @created: 2025-12-07
 */

import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
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
 */
export interface AuthResponse {
  access_token: string;
  user: AuthenticatedUser;
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
  ) {
    const secret =
      process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    this.logger.log(`AuthService инициализирован`);
    this.logger.log(`JWT_SECRET для создания токенов (полное): ${secret}`);
    this.logger.log(`JWT_SECRET длина: ${secret.length} символов`);
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
  async login(loginDto: LoginDto): Promise<AuthResponse> {
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

    // Генерируем JWT токен
    const access_token = this.jwtService.sign(payload);

    this.logger.log(`Токен создан: ${access_token.substring(0, 30)}...`);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }
}
