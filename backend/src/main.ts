import 'reflect-metadata'; // Необходимо для работы декораторов
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { config } from 'dotenv';

// Загружаем переменные окружения из .env файла
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Глобальная валидация - все DTO будут автоматически валидироваться
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Удаляет поля, которых нет в DTO
      forbidNonWhitelisted: true, // Выбрасывает ошибку, если есть лишние поля
      transform: true, // Автоматически преобразует типы (например, string -> number)
    }),
  );

  // Настройка Swagger
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

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Приложение запущено на http://localhost:${port}`);
  console.log(`📚 Swagger документация: http://localhost:${port}/api`);
}

void bootstrap();
