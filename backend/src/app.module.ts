import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { EstimatesModule } from './modules/estimates/estimates.module';

@Module({
  imports: [
    PrismaModule, // Подключаем PrismaModule - теперь PrismaService доступен везде
    UsersModule, // Подключаем модуль пользователей
    AuthModule, // Подключаем модуль аутентификации
    WorkspacesModule, // Подключаем модуль workspace
    EstimatesModule, // Подключаем модуль estimates
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
