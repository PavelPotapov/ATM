/**
 * @file: users.module.ts
 * @description: Модуль пользователей. Объединяет Controller и Service
 * @dependencies: UsersController, UsersService
 * @created: 2025-12-07
 */

import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { WorkspacesModule } from '../workspaces/workspaces.module';

/**
 * UsersModule - модуль для работы с пользователями
 *
 * Модуль в NestJS - это способ организации кода:
 * - Объединяет Controller и Service
 * - Управляет зависимостями (Dependency Injection)
 * - Экспортирует сервисы для использования в других модулях
 */
@Module({
  controllers: [UsersController], // Контроллеры модуля
  providers: [UsersService], // Сервисы модуля
  imports: [forwardRef(() => WorkspacesModule)],
  exports: [UsersService], // Экспортируем для использования в AuthModule
})
export class UsersModule {}
