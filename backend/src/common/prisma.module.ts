/**
 * @file: prisma.module.ts
 * @description: Модуль для экспорта PrismaService. Делает PrismaService доступным для других модулей
 * @dependencies: PrismaService
 * @created: 2025-12-07
 */

import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * PrismaModule - глобальный модуль для работы с БД
 *
 * @Global() - делает модуль глобальным, не нужно импортировать в каждый модуль
 * PrismaService будет доступен во всех модулях приложения
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Экспортируем, чтобы другие модули могли использовать
})
export class PrismaModule {}
