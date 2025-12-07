/**
 * @file: prisma.service.ts
 * @description: Сервис для работы с Prisma Client. Предоставляет единый экземпляр Prisma Client всему приложению
 * @dependencies: @prisma/client
 * @created: 2025-12-07
 */

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

/**
 * PrismaService - сервис для работы с базой данных
 *
 * Использует паттерн Singleton - один экземпляр Prisma Client на всё приложение
 *
 * OnModuleInit - выполняется при инициализации модуля (подключение к БД)
 * OnModuleDestroy - выполняется при остановке модуля (отключение от БД)
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private pool: Pool;

  /**
   * Конструктор - в Prisma v7 нужно использовать adapter для подключения к БД
   */
  constructor() {
    // Проверяем, что DATABASE_URL установлен
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error(
        'DATABASE_URL не установлен в переменных окружения. Проверьте файл .env',
      );
    }

    // Создаем Pool для PostgreSQL (до вызова super)
    const pool = new Pool({ connectionString: databaseUrl });
    // Создаем adapter для Prisma
    const adapter = new PrismaPg(pool);

    // Передаем adapter в PrismaClient (вызываем super)
    super({ adapter });

    // Сохраняем pool для закрытия при уничтожении
    this.pool = pool;
  }

  /**
   * Вызывается при инициализации модуля
   * Подключается к базе данных
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * Вызывается при остановке модуля
   * Отключается от базы данных и закрывает pool
   */
  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}
