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
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

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
@ApiTags('Пользователи')
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
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создание пользователя', description: 'Регистрация нового пользователя в системе' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно создан',
  })
  @ApiResponse({
    status: 400,
    description: 'Ошибка валидации данных',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * GET /users
   * Получение списка всех пользователей
   * Требует аутентификации
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Получение всех пользователей', description: 'Возвращает список всех пользователей системы' })
  @ApiResponse({
    status: 200,
    description: 'Список пользователей',
  })
  @ApiResponse({
    status: 401,
    description: 'Требуется аутентификация',
  })
  findAll(@CurrentUser() user: any) {
    // user - текущий аутентифицированный пользователь
    return this.usersService.findAll();
  }

  /**
   * GET /users/:id
   * Получение пользователя по ID
   * Требует аутентификации
   *
   * @Param('id') - параметр из URL пути
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Получение пользователя по ID' })
  @ApiParam({ name: 'id', description: 'UUID пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Данные пользователя',
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь не найден',
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * PATCH /users/:id
   * Обновление пользователя
   * Требует аутентификации
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Обновление пользователя' })
  @ApiParam({ name: 'id', description: 'UUID пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь успешно обновлен',
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь не найден',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * DELETE /users/:id
   * Удаление пользователя
   * Требует аутентификации
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Удаление пользователя' })
  @ApiParam({ name: 'id', description: 'UUID пользователя' })
  @ApiResponse({
    status: 204,
    description: 'Пользователь успешно удален',
  })
  @ApiResponse({
    status: 404,
    description: 'Пользователь не найден',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
