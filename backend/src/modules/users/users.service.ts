/**
 * @file: users.service.ts
 * @description: Сервис для работы с пользователями. Содержит бизнес-логику работы с БД
 * @dependencies: PrismaService
 * @created: 2025-12-07
 */

import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { Role } from '@prisma/client';
import { hashPassword } from '../../common/utils/password.util';
import { UserWithoutPassword, UserWithPassword } from './types/user.types';
import { WorkspacesService } from '../workspaces/workspaces.service';
import type { AuthenticatedUser } from './types/user.types';

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
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => WorkspacesService))
    private workspacesService: WorkspacesService,
  ) {}

  /**
   * Создание нового пользователя
   * @param createUserDto - данные для создания пользователя
   * @param currentUser - текущий пользователь (админ, создающий пользователя)
   * @returns созданный пользователь (без пароля)
   */
  async create(
    createUserDto: CreateUserDto,
    currentUser: AuthenticatedUser,
  ): Promise<UserWithoutPassword> {
    // Хэшируем пароль перед сохранением
    const hashedPassword = await hashPassword(createUserDto.password);

    // Извлекаем workspaceIds из DTO с явной проверкой типа
    const workspaceIds: string[] | undefined =
      'workspaceIds' in createUserDto
        ? (createUserDto.workspaceIds as string[] | undefined)
        : undefined;

    // Создаем данные для создания пользователя без workspaceIds
    const userData = {
      email: createUserDto.email,
      password: hashedPassword,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      role: createUserDto.role,
    };

    const user = await this.prisma.user.create({
      data: userData,
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

    // Добавляем пользователя в указанные проекты
    if (
      workspaceIds &&
      Array.isArray(workspaceIds) &&
      workspaceIds.length > 0
    ) {
      for (const workspaceId of workspaceIds) {
        if (typeof workspaceId === 'string') {
          try {
            await this.workspacesService.addUser(
              workspaceId,
              { userId: user.id },
              currentUser,
            );
          } catch (error) {
            // Логируем ошибку, но не прерываем создание пользователя
            console.error(
              `Failed to add user ${user.id} to workspace ${workspaceId}:`,
              error,
            );
          }
        }
      }
    }

    return user;
  }

  /**
   * Получение всех пользователей
   * @returns список всех пользователей
   */
  async findAll(): Promise<UserWithoutPassword[]> {
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
   * Поиск пользователя по email (для аутентификации)
   * @param email - email пользователя
   * @returns пользователь с паролем (для проверки) или null
   */
  async findByEmail(email: string): Promise<UserWithPassword | null> {
    return this.prisma.user.findUnique({
      where: { email },
      // Включаем password для проверки при аутентификации
    });
  }

  /**
   * Получение пользователя по ID
   * @param id - ID пользователя
   * @returns пользователь или ошибка 404
   */
  async findOne(id: string): Promise<UserWithoutPassword> {
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
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserWithoutPassword> {
    // Проверяем, существует ли пользователь
    await this.findOne(id);

    // Если обновляется пароль, хэшируем его
    const updateData = { ...updateUserDto };
    if (updateData.password) {
      updateData.password = await hashPassword(updateData.password);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
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
