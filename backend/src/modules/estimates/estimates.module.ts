/**
 * @file: estimates.module.ts
 * @description: Модуль для работы со сметами
 * @dependencies: EstimatesService, EstimatesController
 * @created: 2025-01-04
 */

import { Module } from '@nestjs/common';
import { EstimatesService } from './estimates.service';
import { EstimatesController } from './estimates.controller';

/**
 * EstimatesModule - модуль для работы со сметами
 */
@Module({
  controllers: [EstimatesController],
  providers: [EstimatesService],
  exports: [EstimatesService], // Экспортируем для использования в других модулях
})
export class EstimatesModule {}

