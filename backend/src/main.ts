import 'reflect-metadata'; // Необходимо для работы декораторов
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { setupSwagger } from './common/config/swagger.config';

// Загружаем переменные окружения из .env файла
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Настройка CORS для работы с фронтендом
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // URL фронтенда
    credentials: true, // Разрешаем отправку cookies (для refresh token)
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Глобальная валидация - все DTO будут автоматически валидироваться
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Удаляет поля, которых нет в DTO
      forbidNonWhitelisted: true, // Выбрасывает ошибку, если есть лишние поля
      transform: true, // Автоматически преобразует типы (например, string -> number)
    }),
  );

  // Настройка Swagger
  setupSwagger(app);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Приложение запущено на http://localhost:${port}`);
  console.log(`📚 Swagger документация: http://localhost:${port}/api`);
}

void bootstrap();
