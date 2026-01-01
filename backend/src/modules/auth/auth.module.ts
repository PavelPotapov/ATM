/**
 * @file: auth.module.ts
 * @description: Модуль аутентификации
 * @dependencies: AuthService, AuthController, JwtModule, JwtStrategy
 * @created: 2025-12-07
 */

import { Module, Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PermissionsService } from './services/permissions.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../../common/prisma.module';

/**
 * AuthModule - модуль для аутентификации
 */
@Module({
  imports: [
    // Импортируем UsersModule, чтобы использовать UsersService
    UsersModule,
    // Импортируем PrismaModule для работы с БД
    PrismaModule,
    // PassportModule для работы с стратегиями
    PassportModule,
    // JwtModule для работы с JWT токенами
    JwtModule.registerAsync({
      useFactory: () => {
        const secret =
          process.env.JWT_SECRET || 'your-secret-key-change-in-production';
        const logger = new Logger('AuthModule');
        logger.log(`JwtModule регистрируется с секретом (полное): ${secret}`);
        logger.log(`JWT_SECRET длина: ${secret.length} символов`);
        return {
          secret,
          signOptions: {
            expiresIn: '15m', // Access token действителен 15 минут
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PermissionsService, JwtStrategy],
  exports: [AuthService, PermissionsService], // Экспортируем для использования в других модулях
})
export class AuthModule {}
