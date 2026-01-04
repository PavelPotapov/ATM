/**
 * @file: estimates.controller.ts
 * @description: Контроллер для обработки HTTP запросов, связанных со сметами
 * @dependencies: EstimatesService, DTOs
 * @created: 2025-01-04
 */

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { EstimatesService } from './estimates.service';
import { CreateEstimateDto } from './dto/create-estimate.dto';
import { UpdateEstimateDto } from './dto/update-estimate.dto';
import { CreateEstimateColumnDto } from './dto/create-estimate-column.dto';
import { UpdateEstimateColumnDto } from './dto/update-estimate-column.dto';
import { CreateColumnPermissionDto } from './dto/create-column-permission.dto';
import { UpdateColumnPermissionDto } from './dto/update-column-permission.dto';
import { CreateEstimateRowDto } from './dto/create-estimate-row.dto';
import { UpdateCellDto } from './dto/update-cell.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../users/types/user.types';

/**
 * EstimatesController - контроллер для работы со сметами
 *
 * @Controller('estimates') - базовый путь: /estimates
 */
@ApiTags('Сметы')
@ApiBearerAuth('JWT-auth')
@Controller('estimates')
@UseGuards(JwtAuthGuard) // Все endpoints требуют аутентификации
export class EstimatesController {
  constructor(private readonly estimatesService: EstimatesService) {}

  /**
   * POST /estimates
   * Создание новой сметы
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Создание сметы',
    description: 'Создает новую смету для проекта',
  })
  @ApiResponse({
    status: 201,
    description: 'Смета успешно создана',
  })
  @ApiResponse({
    status: 400,
    description: 'Неверные данные',
  })
  @ApiResponse({
    status: 401,
    description: 'Требуется аутентификация',
  })
  @ApiResponse({
    status: 403,
    description: 'Недостаточно прав (только ADMIN и MANAGER могут создавать сметы)',
  })
  @ApiResponse({
    status: 404,
    description: 'Проект не найден',
  })
  create(
    @Body() createEstimateDto: CreateEstimateDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.estimatesService.create(createEstimateDto, user);
  }

  /**
   * GET /estimates/workspace/:workspaceId
   * Получение всех смет проекта
   */
  @Get('workspace/:workspaceId')
  @ApiOperation({
    summary: 'Получение всех смет проекта',
    description: 'Возвращает список всех смет для указанного проекта',
  })
  @ApiParam({
    name: 'workspaceId',
    description: 'ID проекта',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Список смет',
  })
  @ApiResponse({
    status: 401,
    description: 'Требуется аутентификация',
  })
  @ApiResponse({
    status: 404,
    description: 'Проект не найден',
  })
  findAllByWorkspace(
    @Param('workspaceId') workspaceId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.estimatesService.findAllByWorkspace(workspaceId, user);
  }

  /**
   * GET /estimates/:id
   * Получение сметы по ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Получение сметы по ID',
    description: 'Возвращает информацию о смете с данными о создателе',
  })
  @ApiParam({
    name: 'id',
    description: 'ID сметы',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'full',
    required: false,
    type: Boolean,
    description: 'Получить полную информацию (со столбцами и количеством строк)',
  })
  @ApiResponse({
    status: 200,
    description: 'Информация о смете',
  })
  @ApiResponse({
    status: 401,
    description: 'Требуется аутентификация',
  })
  @ApiResponse({
    status: 404,
    description: 'Смета не найдена',
  })
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Query('full') full?: string,
  ) {
    if (full === 'true') {
      return this.estimatesService.findOneFull(id, user);
    }
    return this.estimatesService.findOne(id, user);
  }

  /**
   * PATCH /estimates/:id
   * Обновление сметы
   */
  @Patch(':id')
  @ApiOperation({
    summary: 'Обновление сметы',
    description: 'Обновляет информацию о смете',
  })
  @ApiParam({
    name: 'id',
    description: 'ID сметы',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Смета успешно обновлена',
  })
  @ApiResponse({
    status: 400,
    description: 'Неверные данные',
  })
  @ApiResponse({
    status: 401,
    description: 'Требуется аутентификация',
  })
  @ApiResponse({
    status: 404,
    description: 'Смета не найдена',
  })
  update(
    @Param('id') id: string,
    @Body() updateEstimateDto: UpdateEstimateDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.estimatesService.update(id, updateEstimateDto, user);
  }

  /**
   * DELETE /estimates/:id
   * Удаление сметы (мягкое удаление)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Удаление сметы',
    description: 'Выполняет мягкое удаление сметы',
  })
  @ApiParam({
    name: 'id',
    description: 'ID сметы',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Смета успешно удалена',
  })
  @ApiResponse({
    status: 401,
    description: 'Требуется аутентификация',
  })
  @ApiResponse({
    status: 404,
    description: 'Смета не найдена',
  })
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.estimatesService.remove(id, user);
  }

  /**
   * POST /estimates/:estimateId/columns
   * Создание столбца сметы
   */
  @Post(':estimateId/columns')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Создание столбца сметы',
    description: 'Создает новый столбец для сметы',
  })
  @ApiParam({
    name: 'estimateId',
    description: 'ID сметы',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 201,
    description: 'Столбец успешно создан',
  })
  @ApiResponse({
    status: 400,
    description: 'Неверные данные или столбец с таким порядком уже существует',
  })
  @ApiResponse({
    status: 401,
    description: 'Требуется аутентификация',
  })
  @ApiResponse({
    status: 403,
    description: 'Недостаточно прав (только ADMIN и MANAGER могут создавать столбцы)',
  })
  @ApiResponse({
    status: 404,
    description: 'Смета не найдена',
  })
  createColumn(
    @Param('estimateId') estimateId: string,
    @Body() createColumnDto: CreateEstimateColumnDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.estimatesService.createColumn(
      { ...createColumnDto, estimateId },
      user,
    );
  }

  /**
   * PATCH /estimates/columns/:columnId
   * Обновление столбца сметы
   */
  @Patch('columns/:columnId')
  @ApiOperation({
    summary: 'Обновление столбца сметы',
    description: 'Обновляет информацию о столбце сметы',
  })
  @ApiParam({
    name: 'columnId',
    description: 'ID столбца',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Столбец успешно обновлен',
  })
  @ApiResponse({
    status: 400,
    description: 'Неверные данные',
  })
  @ApiResponse({
    status: 401,
    description: 'Требуется аутентификация',
  })
  @ApiResponse({
    status: 404,
    description: 'Столбец не найден',
  })
  updateColumn(
    @Param('columnId') columnId: string,
    @Body() updateColumnDto: UpdateEstimateColumnDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.estimatesService.updateColumn(columnId, updateColumnDto, user);
  }

  /**
   * DELETE /estimates/columns/:columnId
   * Удаление столбца сметы
   */
  @Delete('columns/:columnId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Удаление столбца сметы',
    description: 'Удаляет столбец сметы (каскадно удалятся все ячейки)',
  })
  @ApiParam({
    name: 'columnId',
    description: 'ID столбца',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Столбец успешно удален',
  })
  @ApiResponse({
    status: 401,
    description: 'Требуется аутентификация',
  })
  @ApiResponse({
    status: 404,
    description: 'Столбец не найден',
  })
  removeColumn(
    @Param('columnId') columnId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.estimatesService.removeColumn(columnId, user);
  }

  /**
   * GET /estimates/columns/:columnId
   * Получение столбца с полной информацией (создатель и разрешения)
   */
  @Get('columns/:columnId')
  @ApiOperation({
    summary: 'Получение столбца с полной информацией',
    description: 'Возвращает информацию о столбце с данными о создателе и разрешениями для ролей',
  })
  @ApiParam({
    name: 'columnId',
    description: 'ID столбца',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Информация о столбце',
  })
  @ApiResponse({
    status: 401,
    description: 'Требуется аутентификация',
  })
  @ApiResponse({
    status: 404,
    description: 'Столбец не найден',
  })
  getColumnFull(
    @Param('columnId') columnId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.estimatesService.findColumnFull(columnId, user);
  }

  /**
   * POST /estimates/columns/:columnId/permissions
   * Создание разрешения на столбец для роли
   */
  @Post('columns/:columnId/permissions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Создание разрешения на столбец',
    description: 'Создает разрешение на столбец для указанной роли',
  })
  @ApiParam({
    name: 'columnId',
    description: 'ID столбца',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 201,
    description: 'Разрешение успешно создано',
  })
  @ApiResponse({
    status: 400,
    description: 'Неверные данные или разрешение уже существует',
  })
  @ApiResponse({
    status: 401,
    description: 'Требуется аутентификация',
  })
  @ApiResponse({
    status: 403,
    description: 'Недостаточно прав (только ADMIN и MANAGER)',
  })
  @ApiResponse({
    status: 404,
    description: 'Столбец не найден',
  })
  createColumnPermission(
    @Param('columnId') columnId: string,
    @Body() createPermissionDto: CreateColumnPermissionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.estimatesService.createColumnPermission(
      { ...createPermissionDto, columnId },
      user,
    );
  }

  /**
   * PATCH /estimates/columns/permissions/:permissionId
   * Обновление разрешения на столбец
   */
  @Patch('columns/permissions/:permissionId')
  @ApiOperation({
    summary: 'Обновление разрешения на столбец',
    description: 'Обновляет разрешение на столбец для роли',
  })
  @ApiParam({
    name: 'permissionId',
    description: 'ID разрешения',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Разрешение успешно обновлено',
  })
  @ApiResponse({
    status: 400,
    description: 'Неверные данные',
  })
  @ApiResponse({
    status: 401,
    description: 'Требуется аутентификация',
  })
  @ApiResponse({
    status: 403,
    description: 'Недостаточно прав (только ADMIN и MANAGER)',
  })
  @ApiResponse({
    status: 404,
    description: 'Разрешение не найдено',
  })
  updateColumnPermission(
    @Param('permissionId') permissionId: string,
    @Body() updatePermissionDto: UpdateColumnPermissionDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.estimatesService.updateColumnPermission(
      permissionId,
      updatePermissionDto,
      user,
    );
  }

  /**
   * DELETE /estimates/columns/permissions/:permissionId
   * Удаление разрешения на столбец
   */
  @Delete('columns/permissions/:permissionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Удаление разрешения на столбец',
    description: 'Удаляет разрешение на столбец для роли',
  })
  @ApiParam({
    name: 'permissionId',
    description: 'ID разрешения',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Разрешение успешно удалено',
  })
  @ApiResponse({
    status: 401,
    description: 'Требуется аутентификация',
  })
  @ApiResponse({
    status: 403,
    description: 'Недостаточно прав (только ADMIN и MANAGER)',
  })
  @ApiResponse({
    status: 404,
    description: 'Разрешение не найдено',
  })
  removeColumnPermission(
    @Param('permissionId') permissionId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.estimatesService.removeColumnPermission(permissionId, user);
  }

  /**
   * GET /estimates/columns/:columnId/history
   * Получение истории изменений столбца
   */
  @Get('columns/:columnId/history')
  @ApiOperation({
    summary: 'Получение истории изменений столбца',
    description: 'Возвращает историю всех изменений столбца (создание, обновление, изменение разрешений)',
  })
  @ApiParam({
    name: 'columnId',
    description: 'ID столбца',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'История изменений столбца',
  })
  @ApiResponse({
    status: 401,
    description: 'Требуется аутентификация',
  })
  @ApiResponse({
    status: 404,
    description: 'Столбец не найден',
  })
  getColumnHistory(
    @Param('columnId') columnId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.estimatesService.getColumnHistory(columnId, user);
  }

  /**
   * GET /estimates/:estimateId/table
   * Получение данных таблицы сметы (строки с ячейками)
   */
  @Get(':estimateId/table')
  @ApiOperation({
    summary: 'Получение данных таблицы сметы',
    description:
      'Возвращает строки с ячейками с учетом прав доступа (только видимые столбцы)',
  })
  @ApiParam({
    name: 'estimateId',
    description: 'ID сметы',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Данные таблицы сметы',
  })
  @ApiResponse({
    status: 401,
    description: 'Требуется аутентификация',
  })
  @ApiResponse({
    status: 404,
    description: 'Смета не найдена',
  })
  getTableData(
    @Param('estimateId') estimateId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.estimatesService.getTableData(estimateId, user);
  }

  /**
   * POST /estimates/:estimateId/rows
   * Создание новой строки сметы
   */
  @Post(':estimateId/rows')
  @ApiOperation({
    summary: 'Создание новой строки сметы',
    description: 'Создает новую строку с пустыми ячейками для всех столбцов',
  })
  @ApiParam({
    name: 'estimateId',
    description: 'ID сметы',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: CreateEstimateRowDto })
  @ApiResponse({
    status: 201,
    description: 'Строка создана',
  })
  @ApiResponse({
    status: 401,
    description: 'Требуется аутентификация',
  })
  @ApiResponse({
    status: 404,
    description: 'Смета не найдена',
  })
  createRow(
    @Param('estimateId') estimateId: string,
    @Body() createRowDto: CreateEstimateRowDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.estimatesService.createRow(
      { ...createRowDto, estimateId },
      user,
    );
  }

  /**
   * DELETE /estimates/rows/:rowId
   * Удаление строки сметы
   */
  @Delete('rows/:rowId')
  @ApiOperation({
    summary: 'Удаление строки сметы',
    description: 'Удаляет строку и все её ячейки',
  })
  @ApiParam({
    name: 'rowId',
    description: 'ID строки',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Строка удалена',
  })
  @ApiResponse({
    status: 401,
    description: 'Требуется аутентификация',
  })
  @ApiResponse({
    status: 404,
    description: 'Строка не найдена',
  })
  removeRow(
    @Param('rowId') rowId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.estimatesService.removeRow(rowId, user);
  }

  /**
   * PATCH /estimates/cells/:cellId
   * Обновление значения ячейки
   */
  @Patch('cells/:cellId')
  @ApiOperation({
    summary: 'Обновление значения ячейки',
    description:
      'Обновляет значение ячейки с проверкой прав доступа (canEdit) и логированием в историю',
  })
  @ApiParam({
    name: 'cellId',
    description: 'ID ячейки',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateCellDto })
  @ApiResponse({
    status: 200,
    description: 'Ячейка обновлена',
  })
  @ApiResponse({
    status: 401,
    description: 'Требуется аутентификация',
  })
  @ApiResponse({
    status: 403,
    description: 'Недостаточно прав на редактирование столбца',
  })
  @ApiResponse({
    status: 404,
    description: 'Ячейка не найдена',
  })
  updateCell(
    @Param('cellId') cellId: string,
    @Body() updateCellDto: UpdateCellDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.estimatesService.updateCell(cellId, updateCellDto, user);
  }
}

