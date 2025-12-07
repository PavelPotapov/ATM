import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    PrismaModule, // Подключаем PrismaModule - теперь PrismaService доступен везде
    UsersModule, // Подключаем модуль пользователей
    AuthModule, // Подключаем модуль аутентификации
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
