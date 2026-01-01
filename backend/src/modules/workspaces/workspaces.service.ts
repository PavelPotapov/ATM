/**
 * @file: workspaces.service.ts
 * @description: Сервис для работы с рабочими пространствами
 * @dependencies: PrismaService
 * @created: 2025-12-07
 */

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
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
import {
  WorkspaceHistoryAction,
  type WorkspaceHistoryEntry,
} from './types/workspace-history.types';

/**
 * WorkspacesService - сервис для работы с workspace
 */
@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Логирование изменения в истории workspace
   * @param workspaceId - ID workspace
   * @param userId - ID пользователя
   * @param action - действие
   * @param field - измененное поле (опционально)
   * @param oldValue - старое значение (опционально)
   * @param newValue - новое значение (опционально)
   * @param metadata - дополнительные данные (опционально)
   */
  private async logHistory(
    workspaceId: string,
    userId: string,
    action: WorkspaceHistoryAction,
    field: string | null = null,
    oldValue: string | null = null,
    newValue: string | null = null,
    metadata: string | null = null,
  ): Promise<void> {
    await this.prisma.workspaceHistory.create({
      data: {
        workspaceId,
        userId,
        action,
        field,
        oldValue,
        newValue,
        metadata,
      },
    });
  }

  /**
   * Создание нового workspace
   * @param createWorkspaceDto - данные для создания
   * @param user - текущий пользователь (создатель workspace)
   * @returns созданный workspace
   * @throws ForbiddenException если WORKER пытается создать workspace
   */
  async create(
    createWorkspaceDto: CreateWorkspaceDto,
    user: AuthenticatedUser,
  ): Promise<WorkspaceWithTimestamps> {
    // WORKER не может создавать workspace
    if (user.role === Role.WORKER) {
      throw new ForbiddenException(
        'Работники не могут создавать workspace. Обратитесь к менеджеру или администратору.',
      );
    }

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

    // Логируем создание
    await this.logHistory(
      workspace.id,
      user.id,
      WorkspaceHistoryAction.CREATED,
      null,
      null,
      JSON.stringify({
        name: workspace.name,
        description: workspace.description,
      }),
    );

    return workspace;
  }

  /**
   * Получение всех workspace, где пользователь является участником
   * Исключает удаленные workspace (deletedAt !== null)
   * @param user - текущий пользователь
   * @returns список workspace
   */
  async findAll(user: AuthenticatedUser): Promise<WorkspaceWithTimestamps[]> {
    // Если пользователь ADMIN, показываем все не удаленные workspace
    if (user.role === Role.ADMIN) {
      return this.prisma.workspace.findMany({
        where: {
          deletedAt: null, // Исключаем удаленные
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    // Для остальных - только те, где они участники и не удаленные
    const workspaceUsers = await this.prisma.workspaceUser.findMany({
      where: {
        userId: user.id,
        workspace: {
          deletedAt: null, // Исключаем удаленные
        },
      },
      include: {
        workspace: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return workspaceUsers.map(
      (wu): WorkspaceWithTimestamps => ({
        id: wu.workspace.id,
        name: wu.workspace.name,
        description: wu.workspace.description,
        createdAt: wu.workspace.createdAt,
        updatedAt: wu.workspace.updatedAt,
      }),
    );
  }

  /**
   * Получение workspace по ID с проверкой доступа
   * Исключает удаленные workspace
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

    // Проверяем, не удален ли workspace
    if (workspace.deletedAt !== null) {
      throw new NotFoundException(`Workspace с ID ${id} не найден`);
    }

    // Проверяем доступ: ADMIN видит все, остальные - только свои workspace
    if (user.role !== Role.ADMIN) {
      const hasAccess = workspace.users.some((wu) => wu.userId === user.id);
      if (!hasAccess) {
        throw new ForbiddenException('У вас нет доступа к этому workspace');
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
   * Обновление workspace с проверкой прав и логированием
   * @param id - ID workspace
   * @param updateWorkspaceDto - данные для обновления
   * @param user - текущий пользователь
   * @returns обновленный workspace
   * @throws ForbiddenException если WORKER пытается обновить или нет доступа
   */
  async update(
    id: string,
    updateWorkspaceDto: UpdateWorkspaceDto,
    user: AuthenticatedUser,
  ): Promise<WorkspaceWithTimestamps> {
    // WORKER не может обновлять workspace
    if (user.role === Role.WORKER) {
      throw new ForbiddenException(
        'Работники не могут редактировать workspace',
      );
    }

    // Проверяем существование и доступ
    const existingWorkspace = await this.checkAccessAndGet(id, user);

    // Подготавливаем данные для обновления
    const updateData: { name?: string; description?: string | null } = {};

    // Логируем изменения полей
    if (updateWorkspaceDto.name !== undefined) {
      updateData.name = updateWorkspaceDto.name;
      await this.logHistory(
        id,
        user.id,
        WorkspaceHistoryAction.UPDATED,
        'name',
        existingWorkspace.name,
        updateWorkspaceDto.name,
      );
    }

    if (updateWorkspaceDto.description !== undefined) {
      updateData.description = updateWorkspaceDto.description;
      await this.logHistory(
        id,
        user.id,
        WorkspaceHistoryAction.UPDATED,
        'description',
        existingWorkspace.description || null,
        updateWorkspaceDto.description || null,
      );
    }

    // Обновляем workspace
    const updated = await this.prisma.workspace.update({
      where: { id },
      data: updateData,
    });

    return updated;
  }

  /**
   * Мягкое удаление workspace (soft delete)
   * @param id - ID workspace
   * @param user - текущий пользователь
   * @throws ForbiddenException если WORKER пытается удалить или нет доступа
   */
  async remove(id: string, user: AuthenticatedUser): Promise<void> {
    // WORKER не может удалять workspace
    if (user.role === Role.WORKER) {
      throw new ForbiddenException('Работники не могут удалять workspace');
    }

    // Проверяем существование и доступ
    await this.checkAccessAndGet(id, user);

    // Мягкое удаление - устанавливаем deletedAt
    await this.prisma.workspace.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    // Логируем удаление
    await this.logHistory(
      id,
      user.id,
      WorkspaceHistoryAction.DELETED,
      null,
      null,
      null,
      JSON.stringify({ deletedAt: new Date().toISOString() }),
    );
  }

  /**
   * Принудительное удаление workspace (hard delete)
   * Только для ADMIN
   * @param id - ID workspace
   * @param user - текущий пользователь
   * @throws ForbiddenException если не ADMIN
   */
  async permanentlyDelete(id: string, user: AuthenticatedUser): Promise<void> {
    // Только ADMIN может принудительно удалять
    if (user.role !== Role.ADMIN) {
      throw new ForbiddenException(
        'Только администратор может принудительно удалять workspace',
      );
    }

    // Проверяем существование
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace с ID ${id} не найден`);
    }

    // Логируем принудительное удаление перед удалением
    await this.logHistory(
      id,
      user.id,
      WorkspaceHistoryAction.PERMANENTLY_DELETED,
      null,
      null,
      null,
      JSON.stringify({
        name: workspace.name,
        deletedAt: workspace.deletedAt?.toISOString() || null,
      }),
    );

    // Принудительное удаление - удаляем из БД
    await this.prisma.workspace.delete({
      where: { id },
    });
  }

  /**
   * Восстановление workspace из корзины
   * @param id - ID workspace
   * @param user - текущий пользователь
   * @returns восстановленный workspace
   * @throws ForbiddenException если не ADMIN или нет доступа
   */
  async restore(
    id: string,
    user: AuthenticatedUser,
  ): Promise<WorkspaceWithTimestamps> {
    // Только ADMIN и MANAGER могут восстанавливать
    if (user.role === Role.WORKER) {
      throw new ForbiddenException(
        'Работники не могут восстанавливать workspace',
      );
    }

    // Проверяем существование
    const workspace = await this.prisma.workspace.findUnique({
      where: { id },
    });

    if (!workspace) {
      throw new NotFoundException(`Workspace с ID ${id} не найден`);
    }

    if (workspace.deletedAt === null) {
      throw new ForbiddenException('Workspace не удален');
    }

    // Проверяем доступ (для MANAGER - только если он был участником)
    if (user.role !== Role.ADMIN) {
      const hasAccess = await this.prisma.workspaceUser.findUnique({
        where: {
          userId_workspaceId: {
            userId: user.id,
            workspaceId: id,
          },
        },
      });

      if (!hasAccess) {
        throw new ForbiddenException('У вас нет доступа к этому workspace');
      }
    }

    // Восстанавливаем workspace
    const restored = await this.prisma.workspace.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });

    // Логируем восстановление
    await this.logHistory(
      id,
      user.id,
      WorkspaceHistoryAction.RESTORED,
      null,
      null,
      null,
      JSON.stringify({ restoredAt: new Date().toISOString() }),
    );

    return restored;
  }

  /**
   * Добавление пользователя в workspace
   * @param workspaceId - ID workspace
   * @param addUserDto - данные пользователя
   * @param user - текущий пользователь (инициатор)
   * @returns обновленный workspace
   * @throws ForbiddenException если WORKER пытается добавить пользователя или нет доступа
   */
  async addUser(
    workspaceId: string,
    addUserDto: AddUserToWorkspaceDto,
    user: AuthenticatedUser,
  ): Promise<WorkspaceWithUsers> {
    // WORKER не может добавлять пользователей
    if (user.role === Role.WORKER) {
      throw new ForbiddenException(
        'Работники не могут добавлять пользователей в workspace',
      );
    }

    // Проверяем доступ к workspace
    await this.checkAccessAndGet(workspaceId, user);

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

    // Логируем добавление пользователя
    await this.logHistory(
      workspaceId,
      user.id,
      WorkspaceHistoryAction.USER_ADDED,
      'users',
      null,
      JSON.stringify({
        userId: addUserDto.userId,
        userEmail: targetUser.email,
      }),
    );

    // Возвращаем обновленный workspace
    return this.findOne(workspaceId, user);
  }

  /**
   * Удаление пользователя из workspace
   * @param workspaceId - ID workspace
   * @param userId - ID пользователя для удаления
   * @param user - текущий пользователь (инициатор)
   * @returns обновленный workspace
   * @throws ForbiddenException если WORKER пытается удалить пользователя или нет доступа
   */
  async removeUser(
    workspaceId: string,
    userId: string,
    user: AuthenticatedUser,
  ): Promise<WorkspaceWithUsers> {
    // WORKER не может удалять пользователей
    if (user.role === Role.WORKER) {
      throw new ForbiddenException(
        'Работники не могут удалять пользователей из workspace',
      );
    }

    // Проверяем доступ к workspace
    await this.checkAccessAndGet(workspaceId, user);

    // Получаем информацию о пользователе для логирования
    const targetUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    // Удаляем связь
    await this.prisma.workspaceUser.delete({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    // Логируем удаление пользователя
    await this.logHistory(
      workspaceId,
      user.id,
      WorkspaceHistoryAction.USER_REMOVED,
      'users',
      JSON.stringify({
        userId,
        userEmail: targetUser?.email || 'unknown',
      }),
      null,
    );

    // Возвращаем обновленный workspace
    return this.findOne(workspaceId, user);
  }

  /**
   * Получение истории изменений workspace
   * @param workspaceId - ID workspace
   * @param user - текущий пользователь
   * @returns список записей истории
   */
  async getHistory(
    workspaceId: string,
    user: AuthenticatedUser,
  ): Promise<WorkspaceHistoryEntry[]> {
    // Проверяем доступ к workspace
    await this.checkAccessAndGet(workspaceId, user);

    const history = await this.prisma.workspaceHistory.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });

    // Приводим action к типу WorkspaceHistoryAction и явно типизируем результат
    return history.map(
      (entry): WorkspaceHistoryEntry => ({
        id: entry.id,
        workspaceId: entry.workspaceId,
        userId: entry.userId,
        action: entry.action as WorkspaceHistoryAction,
        field: entry.field,
        oldValue: entry.oldValue,
        newValue: entry.newValue,
        metadata: entry.metadata,
        createdAt: entry.createdAt,
      }),
    );
  }

  /**
   * Проверка доступа пользователя к workspace и получение workspace
   * @param workspaceId - ID workspace
   * @param user - текущий пользователь
   * @returns workspace
   * @throws ForbiddenException если нет доступа
   * @throws NotFoundException если workspace не найден или удален
   */
  private async checkAccessAndGet(
    workspaceId: string,
    user: AuthenticatedUser,
  ) {
    // ADMIN имеет доступ ко всем workspace
    if (user.role === Role.ADMIN) {
      const workspace = await this.prisma.workspace.findUnique({
        where: { id: workspaceId },
      });
      if (!workspace) {
        throw new NotFoundException(`Workspace с ID ${workspaceId} не найден`);
      }
      // ADMIN может работать с удаленными workspace (для восстановления)
      return workspace;
    }

    // Остальные - только если они участники и workspace не удален
    const workspaceUser = await this.prisma.workspaceUser.findUnique({
      where: {
        userId_workspaceId: {
          userId: user.id,
          workspaceId,
        },
      },
      include: {
        workspace: true,
      },
    });

    if (!workspaceUser) {
      throw new ForbiddenException('У вас нет доступа к этому workspace');
    }

    // Проверяем, не удален ли workspace
    if (workspaceUser.workspace.deletedAt !== null) {
      throw new NotFoundException(`Workspace с ID ${workspaceId} не найден`);
    }

    return workspaceUser.workspace;
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
    await this.checkAccessAndGet(workspaceId, user);
  }
}
