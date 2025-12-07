/**
 * @file: workspaces.module.ts
 * @description: Модуль для работы с workspace
 * @dependencies: WorkspacesService, WorkspacesController
 * @created: 2025-12-07
 */

import { Module } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { WorkspacesController } from './workspaces.controller';

/**
 * WorkspacesModule - модуль для работы с workspace
 */
@Module({
  controllers: [WorkspacesController],
  providers: [WorkspacesService],
  exports: [WorkspacesService], // Экспортируем для использования в других модулях
})
export class WorkspacesModule {}
