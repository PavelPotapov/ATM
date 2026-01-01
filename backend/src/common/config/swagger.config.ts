/**
 * @file: swagger.config.ts
 * @description: Конфигурация Swagger для API документации
 * @dependencies: @nestjs/swagger
 * @created: 2025-12-07
 */

import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { API_VERSION, getApiPrefix } from './api.config';

/**
 * Настраивает Swagger для приложения
 * @param app - Экземпляр NestJS приложения
 */
export function setupSwagger(app: INestApplication): void {
  const apiPrefix = getApiPrefix();

  const config = new DocumentBuilder()
    .setTitle('ATM API')
    .setDescription('API для управления строительными проектами и сметами')
    .setVersion(API_VERSION)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Введите JWT токен',
        in: 'header',
      },
      'JWT-auth', // Это имя, которое мы будем использовать в декораторе @ApiBearerAuth()
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // Swagger доступен по пути /api/v1 (production) или /v1 (development)
  SwaggerModule.setup(apiPrefix, app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Сохраняет авторизацию между перезагрузками
    },
  });
}
