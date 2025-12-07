/**
 * @file: users.service.ts
 * @description: Сервис для работы с пользователями. Содержит бизнес-логику работы с БД
 * @dependencies: PrismaService
 * @created: 2025-12-07
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';

/**
 * UsersService - сервис для работы с пользователями
 *
 * @Injectable() - делает класс доступным для Dependency Injection
 * NestJS автоматически создаст экземпляр и передаст его в контроллер
 */
@Injectable()
export class UsersService {
  /**
   * Конструктор - Dependency Injection
   * PrismaService автоматически передается NestJS
   */
  constructor(private prisma: PrismaService) {}

  /**
   * Создание нового пользователя
   * @param createUserDto - данные для создания пользователя
   * @returns созданный пользователь (без пароля)
   */
  async create(createUserDto: CreateUserDto) {
    // TODO: Хэшировать пароль перед сохранением (bcrypt)
    const user = await this.prisma.user.create({
      data: createUserDto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // password не включаем в ответ (безопасность)
      },
    });

    return user;
  }

  /**
   * Получение всех пользователей
   * @returns список всех пользователей
   */
  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Получение пользователя по ID
   * @param id - ID пользователя
   * @returns пользователь или ошибка 404
   */
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }

    return user;
  }

  /**
   * Обновление пользователя
   * @param id - ID пользователя
   * @param updateUserDto - данные для обновления
   * @returns обновленный пользователь
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    // Проверяем, существует ли пользователь
    await this.findOne(id);

    // TODO: Если обновляется пароль, нужно его хэшировать

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Удаление пользователя
   * @param id - ID пользователя
   */
  async remove(id: string) {
    await this.findOne(id); // Проверяем существование

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'Пользователь успешно удален' };
  }
}
