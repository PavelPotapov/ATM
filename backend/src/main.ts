import 'reflect-metadata'; // Необходимо для работы декораторов
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { setupSwagger } from './common/config/swagger.config';
import { getApiPrefix } from './common/config/api.config';
import { isSpaRoute } from './common/utils/request.util';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import type { Request, Response, NextFunction } from 'express';

// Загружаем переменные окружения из .env файла
config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Настройка CORS для работы с фронтендом
  // В production: разрешаем все origins (так как фронтенд и API на одном домене через ngrok)
  // В development: используем FRONTEND_URL из .env
  const isProduction = process.env.NODE_ENV === 'production';
  const frontendUrls = isProduction
    ? true // В production разрешаем все origins (фронтенд и API на одном домене)
    : (process.env.FRONTEND_URL || 'http://localhost:5173')
        .split(',')
        .map((url) => url.trim())
        .filter(Boolean);

  app.enableCors({
    origin: frontendUrls, // В production: true (все origins), в dev: конкретные URLs
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

  // Устанавливаем глобальный префикс для API с версионированием
  // Всегда: /api/v1 (единообразно для development и production)
  const apiPrefix = getApiPrefix();
  app.setGlobalPrefix(apiPrefix);

  // Настройка Swagger (должна быть после setGlobalPrefix)
  setupSwagger(app);

  // В production: отдаем статические файлы фронтенда
  if (process.env.NODE_ENV === 'production') {
    // В production __dirname = dist/src, поэтому public будет в dist/public
    const publicPath = join(__dirname, '..', 'public');

    // Отдаем статические файлы (JS, CSS, изображения и т.д.)
    app.useStaticAssets(publicPath, {
      index: false, // Не используем index.html напрямую
    });

    // SPA fallback: все не-API запросы отдаем index.html
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (isSpaRoute(req)) {
        res.sendFile(join(publicPath, 'index.html'));
      } else {
        next();
      }
    });
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Приложение запущено на http://localhost:${port}`);
  if (process.env.NODE_ENV === 'production') {
    console.log(`📦 Статические файлы отдаются из папки dist/public`);
  }
  console.log(`📚 Swagger документация: http://localhost:${port}/${apiPrefix}`);
}

void bootstrap();
