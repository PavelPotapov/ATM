/**
 * @file: workspaces.controller.ts
 * @description: Контроллер для обработки HTTP запросов, связанных с workspace
 * @dependencies: WorkspacesService, DTOs
 * @created: 2025-12-07
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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { WorkspacesService } from './workspaces.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { AddUserToWorkspaceDto } from './dto/add-user-to-workspace.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../users/types/user.types';

/**
 * WorkspacesController - контроллер для работы с workspace
 *
 * @Controller('workspaces') - базовый путь: /workspaces
 */
@ApiTags('Рабочие пространства')
@ApiBearerAuth('JWT-auth')
@Controller('workspaces')
@UseGuards(JwtAuthGuard) // Все endpoints требуют аутентификации
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  /**
   * POST /workspaces
   * Создание нового workspace
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Создание workspace',
    description:
      'Создает новое рабочее пространство. Создатель автоматически добавляется как участник',
  })
  @ApiResponse({
    status: 201,
    description: 'Workspace успешно создан',
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка валидации данных',
  })
  create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.workspacesService.create(createWorkspaceDto, user);
  }

  /**
   * GET /workspaces
   * Получение списка workspace пользователя
   */
  @Get()
  @ApiOperation({
    summary: 'Получение списка workspace',
    description:
      'Возвращает список workspace пользователя. ADMIN видит все workspace',
  })
  @ApiResponse({
    status: 200,
    description: 'Список workspace',
  })
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.workspacesService.findAll(user);
  }

  /**
   * GET /workspaces/:id
   * Получение workspace по ID
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Получение workspace по ID',
    description: 'Возвращает workspace с информацией о пользователях',
  })
  @ApiParam({ name: 'id', description: 'UUID workspace' })
  @ApiResponse({
    status: 200,
    description: 'Данные workspace',
  })
  @ApiResponse({
    status: 403,
    description: 'Нет доступа к workspace',
  })
  @ApiResponse({
    status: 404,
    description: 'Workspace не найден',
  })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.workspacesService.findOne(id, user);
  }

  /**
   * PATCH /workspaces/:id
   * Обновление workspace
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Обновление workspace' })
  @ApiParam({ name: 'id', description: 'UUID workspace' })
  @ApiResponse({
    status: 200,
    description: 'Workspace успешно обновлен',
  })
  @ApiResponse({
    status: 403,
    description: 'Нет доступа к workspace',
  })
  @ApiResponse({
    status: 404,
    description: 'Workspace не найден',
  })
  update(
    @Param('id') id: string,
    @Body() updateWorkspaceDto: UpdateWorkspaceDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.workspacesService.update(id, updateWorkspaceDto, user);
  }

  /**
   * DELETE /workspaces/:id
   * Удаление workspace
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Удаление workspace' })
  @ApiParam({ name: 'id', description: 'UUID workspace' })
  @ApiResponse({
    status: 204,
    description: 'Workspace успешно удален',
  })
  @ApiResponse({
    status: 403,
    description: 'Нет доступа к workspace',
  })
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    await this.workspacesService.remove(id, user);
  }

  /**
   * POST /workspaces/:id/users
   * Добавление пользователя в workspace
   */
  @Post(':id/users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Добавление пользователя в workspace' })
  @ApiParam({ name: 'id', description: 'UUID workspace' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь успешно добавлен',
  })
  @ApiResponse({
    status: 403,
    description: 'Нет доступа или пользователь уже добавлен',
  })
  @ApiResponse({
    status: 404,
    description: 'Workspace или пользователь не найден',
  })
  addUser(
    @Param('id') workspaceId: string,
    @Body() addUserDto: AddUserToWorkspaceDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.workspacesService.addUser(workspaceId, addUserDto, user);
  }

  /**
   * DELETE /workspaces/:id/users/:userId
   * Удаление пользователя из workspace
   */
  @Delete(':id/users/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Удаление пользователя из workspace' })
  @ApiParam({ name: 'id', description: 'UUID workspace' })
  @ApiParam({ name: 'userId', description: 'UUID пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь успешно удален из workspace',
  })
  @ApiResponse({
    status: 403,
    description: 'Нет доступа к workspace',
  })
  removeUser(
    @Param('id') workspaceId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.workspacesService.removeUser(workspaceId, userId, user);
  }
}
