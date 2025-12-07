/**
 * @file: swagger.config.ts
 * @description: Конфигурация Swagger для API документации
 * @dependencies: @nestjs/swagger
 * @created: 2025-12-07
 */

import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

/**
 * Настраивает Swagger для приложения
 * @param app - Экземпляр NestJS приложения
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('ATM API')
    .setDescription('API для управления строительными проектами и сметами')
    .setVersion('1.0')
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
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Сохраняет авторизацию между перезагрузками
    },
  });
}
