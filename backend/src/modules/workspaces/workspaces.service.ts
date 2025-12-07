/**
 * @file: workspaces.service.ts
 * @description: Сервис для работы с рабочими пространствами
 * @dependencies: PrismaService
 * @created: 2025-12-07
 */

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { AddUserToWorkspaceDto } from './dto/add-user-to-workspace.dto';
import {
  WorkspaceWithTimestamps,
  WorkspaceWithUsers,
} from './types/workspace.types';
import { AuthenticatedUser } from '../users/types/user.types';
import { Role } from '@prisma/client';

/**
 * WorkspacesService - сервис для работы с workspace
 */
@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Создание нового workspace
   * @param createWorkspaceDto - данные для создания
   * @param user - текущий пользователь (создатель workspace)
   * @returns созданный workspace
   */
  async create(
    createWorkspaceDto: CreateWorkspaceDto,
    user: AuthenticatedUser,
  ): Promise<WorkspaceWithTimestamps> {
    // Создаем workspace и сразу добавляем создателя как участника
    const workspace = await this.prisma.workspace.create({
      data: {
        name: createWorkspaceDto.name,
        description: createWorkspaceDto.description,
        users: {
          create: {
            userId: user.id,
          },
        },
      },
      include: {
        users: false, // Не включаем пользователей в базовый ответ
      },
    });

    return workspace;
  }

  /**
   * Получение всех workspace, где пользователь является участником
   * @param user - текущий пользователь
   * @returns список workspace
   */
  async findAll(user: AuthenticatedUser): Promise<WorkspaceWithTimestamps[]> {
    // Если пользователь ADMIN, показываем все workspace
    if (user.role === Role.ADMIN) {
      return this.prisma.workspace.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    // Для остальных - только те, где они участники
    const workspaceUsers = await this.prisma.workspaceUser.findMany({
      where: { userId: user.id },
      include: {
        workspace: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return workspaceUsers.map((wu) => wu.workspace);
  }

  /**
   * Получение workspace по ID с проверкой доступа
   * @param id - ID workspace
   * @param user - текущий пользователь
   * @returns workspace с информацией о пользователях
   */
  async findOne(
    id: string,
    user: AuthenticatedUser,
  ): Promise<WorkspaceWithUsers> {
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
      include: {
        users: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace с ID ${id} не найден`);
    }

    // Проверяем доступ: ADMIN видит все, остальные - только свои workspace
    if (user.role !== Role.ADMIN) {
      const hasAccess = workspace.users.some((wu) => wu.userId === user.id);
      if (!hasAccess) {
        throw new ForbiddenException(
          'У вас нет доступа к этому workspace',
        );
      }
    }

    return {
      id: workspace.id,
      name: workspace.name,
      description: workspace.description,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
      users: workspace.users.map((wu) => wu.user),
    };
  }

  /**
   * Обновление workspace с проверкой прав
   * @param id - ID workspace
   * @param updateWorkspaceDto - данные для обновления
   * @param user - текущий пользователь
   * @returns обновленный workspace
   */
  async update(
    id: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
    user: AuthenticatedUser,
  ): Promise<WorkspaceWithTimestamps> {
    // Проверяем существование и доступ
    await this.checkAccess(id, user);

    return this.prisma.workspace.update({
      where: { id },
      data: updateWorkspaceDto,
    });
  }

  /**
   * Удаление workspace с проверкой прав
   * @param id - ID workspace
   * @param user - текущий пользователь
   */
  async remove(id: string, user: AuthenticatedUser): Promise<void> {
    // Проверяем существование и доступ
    await this.checkAccess(id, user);

    await this.prisma.workspace.delete({
      where: { id },
    });
  }

  /**
   * Добавление пользователя в workspace
   * @param workspaceId - ID workspace
   * @param addUserDto - данные пользователя
   * @param user - текущий пользователь (инициатор)
   * @returns обновленный workspace
   */
  async addUser(
    workspaceId: string,
    addUserDto: AddUserToWorkspaceDto,
    user: AuthenticatedUser,
  ): Promise<WorkspaceWithUsers> {
    // Проверяем доступ к workspace
    await this.checkAccess(workspaceId, user);

    // Проверяем, существует ли пользователь
    const targetUser = await this.prisma.user.findUnique({
      where: { id: addUserDto.userId },
    });

    if (!targetUser) {
      throw new NotFoundException(
        `Пользователь с ID ${addUserDto.userId} не найден`,
      );
    }

    // Проверяем, не добавлен ли уже пользователь
    const existing = await this.prisma.workspaceUser.findUnique({
      where: {
        userId_workspaceId: {
          userId: addUserDto.userId,
          workspaceId,
        },
      },
    });

    if (existing) {
      throw new ForbiddenException(
        'Пользователь уже является участником этого workspace',
      );
    }

    // Добавляем пользователя
    await this.prisma.workspaceUser.create({
      data: {
        userId: addUserDto.userId,
        workspaceId,
      },
    });

    // Возвращаем обновленный workspace
    return this.findOne(workspaceId, user);
  }

  /**
   * Удаление пользователя из workspace
   * @param workspaceId - ID workspace
   * @param userId - ID пользователя для удаления
   * @param user - текущий пользователь (инициатор)
   * @returns обновленный workspace
   */
  async removeUser(
    workspaceId: string,
    userId: string,
    user: AuthenticatedUser,
  ): Promise<WorkspaceWithUsers> {
    // Проверяем доступ к workspace
    await this.checkAccess(workspaceId, user);

    // Удаляем связь
    await this.prisma.workspaceUser.delete({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    // Возвращаем обновленный workspace
    return this.findOne(workspaceId, user);
  }

  /**
   * Проверка доступа пользователя к workspace
   * @param workspaceId - ID workspace
   * @param user - текущий пользователь
   * @throws ForbiddenException если нет доступа
   */
  private async checkAccess(
    workspaceId: string,
    user: AuthenticatedUser,
  ): Promise<void> {
    // ADMIN имеет доступ ко всем workspace
    if (user.role === Role.ADMIN) {
      const workspace = await this.prisma.workspace.findUnique({
        where: { id: workspaceId },
      });
      if (!workspace) {
        throw new NotFoundException(
          `Workspace с ID ${workspaceId} не найден`,
        );
      }
      return;
    }

    // Остальные - только если они участники
    const workspaceUser = await this.prisma.workspaceUser.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId,
        },
      },
    });

    if (!workspaceUser) {
      throw new ForbiddenException(
        'У вас нет доступа к этому workspace',
      );
    }
  }
}

