/**
 * @file: users.controller.ts
 * @description: Контроллер для обработки HTTP запросов, связанных с пользователями
 * @dependencies: UsersService, DTOs
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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * UsersController - контроллер для работы с пользователями
 * 
 * @Controller('users') - базовый путь для всех роутов: /users
 * 
 * Декораторы HTTP методов:
 * - @Get() - GET запрос
 * - @Post() - POST запрос
 * - @Patch() - PATCH запрос (частичное обновление)
 * - @Delete() - DELETE запрос
 */
@Controller('users')
export class UsersController {
  /**
   * Конструктор - Dependency Injection
   * UsersService автоматически передается NestJS
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /users
   * Создание нового пользователя
   * 
   * @Body() - данные из тела запроса
   * @Body() createUserDto - автоматически валидируется через CreateUserDto
   */
  @Post()
  @HttpCode(HttpStatus.CREATED) // Возвращаем статус 201 вместо 200
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * GET /users
   * Получение списка всех пользователей
   */
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  /**
   * GET /users/:id
   * Получение пользователя по ID
   * 
   * @Param('id') - параметр из URL пути
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * PATCH /users/:id
   * Обновление пользователя
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * DELETE /users/:id
   * Удаление пользователя
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

