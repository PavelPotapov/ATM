/**
 * @file: estimates.service.ts
 * @description: Сервис для работы со сметами
 * @dependencies: PrismaService
 * @created: 2025-01-04
 */

import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CreateEstimateDto } from './dto/create-estimate.dto';
import { UpdateEstimateDto } from './dto/update-estimate.dto';
import { CreateEstimateColumnDto } from './dto/create-estimate-column.dto';
import { UpdateEstimateColumnDto } from './dto/update-estimate-column.dto';
import { CreateColumnPermissionDto } from './dto/create-column-permission.dto';
import { UpdateColumnPermissionDto } from './dto/update-column-permission.dto';
import {
  EstimateWithTimestamps,
  EstimateWithCreator,
  EstimateFull,
} from './types/estimate.types';
import {
  EstimateColumnFull,
  ColumnRolePermissionType,
} from './types/estimate-column.types';
import {
  ColumnHistoryType,
  ColumnHistoryAction,
} from './types/column-history.types';
import {
  EstimateTableData,
  EstimateRowWithCells,
  CellType,
} from './types/estimate-row.types';
import { AuthenticatedUser } from '../users/types/user.types';
import { Role } from '@prisma/client';
import { CreateEstimateRowDto } from './dto/create-estimate-row.dto';
import { UpdateCellDto } from './dto/update-cell.dto';

/**
 * EstimatesService - сервис для работы со сметами
 */
@Injectable()
export class EstimatesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Проверка доступа пользователя к workspace
   * @param workspaceId - ID проекта
   * @param user - текущий пользователь
   * @throws NotFoundException если workspace не найден
   * @throws ForbiddenException если у пользователя нет доступа
   */
  private async checkWorkspaceAccess(
    workspaceId: string,
    user: AuthenticatedUser,
  ): Promise<void> {
    // ADMIN видит все workspace
    if (user.role === Role.ADMIN) {
      const workspace = await this.prisma.workspace.findUnique({
        where: { id: workspaceId },
      });
      if (!workspace) {
        throw new NotFoundException('Проект не найден');
      }
      return;
    }

    // MANAGER и WORKER видят только свои workspace
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

    if (!workspaceUser || workspaceUser.workspace.deletedAt) {
      throw new NotFoundException('Проект не найден или у вас нет доступа');
    }
  }

  /**
   * Создание новой сметы
   * @param createEstimateDto - данные для создания
   * @param user - текущий пользователь
   * @returns созданная смета
   * @throws ForbiddenException если WORKER пытается создать смету
   */
  async create(
    createEstimateDto: CreateEstimateDto,
    user: AuthenticatedUser,
  ): Promise<EstimateWithTimestamps> {
    // WORKER не может создавать сметы
    if (user.role === Role.WORKER) {
      throw new ForbiddenException(
        'Работники не могут создавать сметы. Обратитесь к менеджеру или администратору.',
      );
    }

    // Проверяем доступ к workspace
    await this.checkWorkspaceAccess(createEstimateDto.workspaceId, user);

    // Создаем смету
    const estimate = await this.prisma.estimate.create({
      data: {
        workspaceId: createEstimateDto.workspaceId,
        createdById: user.id,
        name: createEstimateDto.name,
        description: createEstimateDto.description || null,
      },
      select: {
        id: true,
        workspaceId: true,
        createdById: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return estimate;
  }

  /**
   * Получение всех смет проекта
   * @param workspaceId - ID проекта
   * @param user - текущий пользователь
   * @returns список смет
   */
  async findAllByWorkspace(
    workspaceId: string,
    user: AuthenticatedUser,
  ): Promise<EstimateWithTimestamps[]> {
    // Проверяем доступ к workspace
    await this.checkWorkspaceAccess(workspaceId, user);

    const estimates = await this.prisma.estimate.findMany({
      where: {
        workspaceId,
        deletedAt: null,
      },
      select: {
        id: true,
        workspaceId: true,
        createdById: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return estimates;
  }

  /**
   * Получение сметы по ID
   * @param id - ID сметы
   * @param user - текущий пользователь
   * @returns смета с информацией о создателе
   */
  async findOne(
    id: string,
    user: AuthenticatedUser,
  ): Promise<EstimateWithCreator> {
    const estimate = await this.prisma.estimate.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!estimate || estimate.deletedAt) {
      throw new NotFoundException('Смета не найдена');
    }

    // Проверяем доступ к workspace
    await this.checkWorkspaceAccess(estimate.workspaceId, user);

    return estimate;
  }

  /**
   * Получение полной информации о смете (со столбцами и количеством строк)
   * @param id - ID сметы
   * @param user - текущий пользователь
   * @returns полная информация о смете
   */
  async findOneFull(
    id: string,
    user: AuthenticatedUser,
  ): Promise<EstimateFull> {
    const estimate = await this.findOne(id, user);

    // Получаем столбцы
    const columns = await this.prisma.estimateColumn.findMany({
      where: {
        estimateId: id,
      },
      orderBy: {
        order: 'asc',
      },
      select: {
        id: true,
        estimateId: true,
        createdById: true,
        name: true,
        dataType: true,
        order: true,
        required: true,
        allowedValues: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Получаем количество строк
    const rowsCount = await this.prisma.estimateRow.count({
      where: {
        estimateId: id,
      },
    });

    return {
      ...estimate,
      columns,
      rowsCount,
    };
  }

  /**
   * Обновление сметы
   * @param id - ID сметы
   * @param updateEstimateDto - данные для обновления
   * @param user - текущий пользователь
   * @returns обновленная смета
   */
  async update(
    id: string,
    updateEstimateDto: UpdateEstimateDto,
    user: AuthenticatedUser,
  ): Promise<EstimateWithTimestamps> {
    // Проверяем доступ к workspace (если workspaceId меняется)
    if (updateEstimateDto.workspaceId) {
      await this.checkWorkspaceAccess(updateEstimateDto.workspaceId, user);
    }

    const updated = await this.prisma.estimate.update({
      where: { id },
      data: {
        ...(updateEstimateDto.name && { name: updateEstimateDto.name }),
        ...(updateEstimateDto.description !== undefined && {
          description: updateEstimateDto.description || null,
        }),
        ...(updateEstimateDto.workspaceId && {
          workspaceId: updateEstimateDto.workspaceId,
        }),
      },
      select: {
        id: true,
        workspaceId: true,
        createdById: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updated;
  }

  /**
   * Удаление сметы (мягкое удаление)
   * @param id - ID сметы
   * @param user - текущий пользователь
   */
  async remove(id: string, user: AuthenticatedUser): Promise<void> {
    await this.findOne(id, user);

    await this.prisma.estimate.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  /**
   * Создание столбца сметы
   * @param createColumnDto - данные для создания столбца
   * @param user - текущий пользователь
   * @returns созданный столбец
   * @throws ForbiddenException если WORKER пытается создать столбец
   */
  async createColumn(
    createColumnDto: CreateEstimateColumnDto,
    user: AuthenticatedUser,
  ) {
    // WORKER не может создавать столбцы
    if (user.role === Role.WORKER) {
      throw new ForbiddenException(
        'Работники не могут создавать столбцы смет. Обратитесь к менеджеру или администратору.',
      );
    }

    // Проверяем, что смета существует и у пользователя есть доступ
    await this.findOne(createColumnDto.estimateId, user);

    // Проверяем, что столбец с таким порядком не существует
    const existingColumn = await this.prisma.estimateColumn.findFirst({
      where: {
        estimateId: createColumnDto.estimateId,
        order: createColumnDto.order,
      },
    });

    if (existingColumn) {
      throw new BadRequestException(
        `Столбец с порядком ${createColumnDto.order} уже существует`,
      );
    }

    // Преобразуем allowedValues в JSON строку, если это ENUM тип
    let allowedValuesJson: string | null = null;
    if (
      createColumnDto.dataType === 'ENUM' &&
      createColumnDto.allowedValues &&
      createColumnDto.allowedValues.length > 0
    ) {
      allowedValuesJson = JSON.stringify(createColumnDto.allowedValues);
    }

    const column = await this.prisma.estimateColumn.create({
      data: {
        estimateId: createColumnDto.estimateId,
        createdById: user.id,
        name: createColumnDto.name,
        dataType: createColumnDto.dataType,
        order: createColumnDto.order,
        required: createColumnDto.required,
        allowedValues: allowedValuesJson,
      },
      select: {
        id: true,
        estimateId: true,
        createdById: true,
        name: true,
        dataType: true,
        order: true,
        required: true,
        allowedValues: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Логируем создание столбца
    await this.prisma.columnHistory.create({
      data: {
        columnId: column.id,
        userId: user.id,
        action: ColumnHistoryAction.CREATED,
        field: null,
        oldValue: null,
        newValue: JSON.stringify({
          name: column.name,
          dataType: column.dataType,
          order: column.order,
          required: column.required,
          allowedValues: column.allowedValues,
        }),
        metadata: null,
      },
    });

    return column;
  }

  /**
   * Обновление столбца сметы
   * @param columnId - ID столбца
   * @param updateColumnDto - данные для обновления
   * @param user - текущий пользователь
   * @returns обновленный столбец
   */
  async updateColumn(
    columnId: string,
    updateColumnDto: UpdateEstimateColumnDto,
    user: AuthenticatedUser,
  ) {
    const column = await this.prisma.estimateColumn.findUnique({
      where: { id: columnId },
      include: {
        estimate: true,
      },
    });

    if (!column) {
      throw new NotFoundException('Столбец не найден');
    }

    // Проверяем доступ к смете
    await this.checkWorkspaceAccess(column.estimate.workspaceId, user);

    // Если меняется порядок, проверяем конфликты
    if (updateColumnDto.order !== undefined) {
      const existingColumn = await this.prisma.estimateColumn.findFirst({
        where: {
          estimateId: column.estimateId,
          order: updateColumnDto.order,
          id: { not: columnId },
        },
      });

      if (existingColumn) {
        throw new BadRequestException(
          `Столбец с порядком ${updateColumnDto.order} уже существует`,
        );
      }
    }

    // Преобразуем allowedValues в JSON строку, если это ENUM тип
    let allowedValuesJson: string | null = column.allowedValues;
    if (
      (updateColumnDto.dataType === 'ENUM' || column.dataType === 'ENUM') &&
      updateColumnDto.allowedValues !== undefined
    ) {
      if (updateColumnDto.allowedValues.length > 0) {
        allowedValuesJson = JSON.stringify(updateColumnDto.allowedValues);
      } else {
        allowedValuesJson = null;
      }
    }

    const updated = await this.prisma.estimateColumn.update({
      where: { id: columnId },
      data: {
        ...(updateColumnDto.name && { name: updateColumnDto.name }),
        ...(updateColumnDto.dataType !== undefined && {
          dataType: updateColumnDto.dataType,
        }),
        ...(updateColumnDto.order !== undefined && {
          order: updateColumnDto.order,
        }),
        ...(updateColumnDto.required !== undefined && {
          required: updateColumnDto.required,
        }),
        ...(allowedValuesJson !== undefined && {
          allowedValues: allowedValuesJson,
        }),
      },
      select: {
        id: true,
        estimateId: true,
        createdById: true,
        name: true,
        dataType: true,
        order: true,
        required: true,
        allowedValues: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Логируем изменения столбца
    const historyEntries: Array<{
      columnId: string;
      userId: string;
      action: ColumnHistoryAction;
      field: string;
      oldValue: string | null;
      newValue: string | null;
      metadata: string | null;
    }> = [];
    if (updateColumnDto.name && updateColumnDto.name !== column.name) {
      historyEntries.push({
        columnId: column.id,
        userId: user.id,
        action: ColumnHistoryAction.UPDATED,
        field: 'name',
        oldValue: column.name,
        newValue: updateColumnDto.name,
        metadata: null,
      });
    }
    if (
      updateColumnDto.dataType !== undefined &&
      updateColumnDto.dataType !== column.dataType
    ) {
      historyEntries.push({
        columnId: column.id,
        userId: user.id,
        action: ColumnHistoryAction.UPDATED,
        field: 'dataType',
        oldValue: column.dataType,
        newValue: updateColumnDto.dataType,
        metadata: null,
      });
    }
    if (
      updateColumnDto.order !== undefined &&
      updateColumnDto.order !== column.order
    ) {
      historyEntries.push({
        columnId: column.id,
        userId: user.id,
        action: ColumnHistoryAction.UPDATED,
        field: 'order',
        oldValue: String(column.order),
        newValue: String(updateColumnDto.order),
        metadata: null,
      });
    }
    if (
      updateColumnDto.required !== undefined &&
      updateColumnDto.required !== column.required
    ) {
      historyEntries.push({
        columnId: column.id,
        userId: user.id,
        action: ColumnHistoryAction.UPDATED,
        field: 'required',
        oldValue: String(column.required),
        newValue: String(updateColumnDto.required),
        metadata: null,
      });
    }
    if (
      allowedValuesJson !== undefined &&
      allowedValuesJson !== column.allowedValues
    ) {
      historyEntries.push({
        columnId: column.id,
        userId: user.id,
        action: ColumnHistoryAction.UPDATED,
        field: 'allowedValues',
        oldValue: column.allowedValues,
        newValue: allowedValuesJson,
        metadata: null,
      });
    }

    if (historyEntries.length > 0) {
      await this.prisma.columnHistory.createMany({
        data: historyEntries,
      });
    }

    return updated;
  }

  /**
   * Удаление столбца сметы
   * @param columnId - ID столбца
   * @param user - текущий пользователь
   */
  async removeColumn(columnId: string, user: AuthenticatedUser): Promise<void> {
    const column = await this.prisma.estimateColumn.findUnique({
      where: { id: columnId },
      include: {
        estimate: true,
      },
    });

    if (!column) {
      throw new NotFoundException('Столбец не найден');
    }

    // Проверяем доступ к смете
    await this.checkWorkspaceAccess(column.estimate.workspaceId, user);

    // Удаляем столбец (каскадно удалятся все ячейки)
    await this.prisma.estimateColumn.delete({
      where: { id: columnId },
    });
  }

  /**
   * Получение столбца с полной информацией (создатель и разрешения)
   * @param columnId - ID столбца
   * @param user - текущий пользователь
   * @returns полная информация о столбце
   */
  async findColumnFull(
    columnId: string,
    user: AuthenticatedUser,
  ): Promise<EstimateColumnFull> {
    const column = await this.prisma.estimateColumn.findUnique({
      where: { id: columnId },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        estimate: true,
        permissions: {
          select: {
            id: true,
            columnId: true,
            role: true,
            canView: true,
            canEdit: true,
            canCreate: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!column) {
      throw new NotFoundException('Столбец не найден');
    }

    // Проверяем доступ к смете
    await this.checkWorkspaceAccess(column.estimate.workspaceId, user);

    return {
      id: column.id,
      estimateId: column.estimateId,
      createdById: column.createdById,
      name: column.name,
      dataType: column.dataType,
      order: column.order,
      required: column.required,
      allowedValues: column.allowedValues,
      createdAt: column.createdAt,
      updatedAt: column.updatedAt,
      createdBy: column.createdBy,
      rolePermissions: column.permissions.map((perm) => ({
        id: perm.id,
        columnId: perm.columnId,
        role: perm.role,
        canView: perm.canView,
        canEdit: perm.canEdit,
        canCreate: perm.canCreate,
        createdAt: perm.createdAt,
        updatedAt: perm.updatedAt,
      })),
    };
  }

  /**
   * Создание разрешения на столбец для роли
   * @param createPermissionDto - данные для создания разрешения
   * @param user - текущий пользователь
   * @returns созданное разрешение
   */
  async createColumnPermission(
    createPermissionDto: CreateColumnPermissionDto,
    user: AuthenticatedUser,
  ): Promise<ColumnRolePermissionType> {
    // Только ADMIN и MANAGER могут управлять разрешениями
    if (user.role === Role.WORKER) {
      throw new ForbiddenException(
        'Работники не могут управлять разрешениями на столбцы',
      );
    }

    // Проверяем, что столбец существует и у пользователя есть доступ
    const column = await this.prisma.estimateColumn.findUnique({
      where: { id: createPermissionDto.columnId },
      include: {
        estimate: true,
      },
    });

    if (!column) {
      throw new NotFoundException('Столбец не найден');
    }

    // Проверяем доступ к смете
    await this.checkWorkspaceAccess(column.estimate.workspaceId, user);

    // Проверяем, не существует ли уже разрешение для этой роли
    const existing = await this.prisma.columnRolePermission.findFirst({
      where: {
        columnId: createPermissionDto.columnId,
        role: createPermissionDto.role,
      },
    });

    if (existing) {
      throw new BadRequestException(
        `Разрешение для роли ${createPermissionDto.role} уже существует`,
      );
    }

    const permission = await this.prisma.columnRolePermission.create({
      data: {
        columnId: createPermissionDto.columnId,
        role: createPermissionDto.role,
        canView: createPermissionDto.canView,
        canEdit: createPermissionDto.canEdit,
        canCreate: createPermissionDto.canCreate,
      },
      select: {
        id: true,
        columnId: true,
        role: true,
        canView: true,
        canEdit: true,
        canCreate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Логируем создание разрешения
    await this.prisma.columnHistory.create({
      data: {
        columnId: createPermissionDto.columnId,
        userId: user.id,
        action: ColumnHistoryAction.PERMISSION_CHANGED,
        field: 'permission',
        oldValue: null,
        newValue: JSON.stringify({
          role: permission.role,
          canView: permission.canView,
          canEdit: permission.canEdit,
        }),
        metadata: JSON.stringify({
          permissionId: permission.id,
          role: permission.role,
        }),
      },
    });

    return permission;
  }

  /**
   * Обновление разрешения на столбец для роли
   * @param permissionId - ID разрешения
   * @param updatePermissionDto - данные для обновления
   * @param user - текущий пользователь
   * @returns обновленное разрешение
   */
  async updateColumnPermission(
    permissionId: string,
    updatePermissionDto: UpdateColumnPermissionDto,
    user: AuthenticatedUser,
  ): Promise<ColumnRolePermissionType> {
    // Только ADMIN и MANAGER могут управлять разрешениями
    if (user.role === Role.WORKER) {
      throw new ForbiddenException(
        'Работники не могут управлять разрешениями на столбцы',
      );
    }

    const permission = await this.prisma.columnRolePermission.findUnique({
      where: { id: permissionId },
      include: {
        column: {
          include: {
            estimate: true,
          },
        },
      },
    });

    if (!permission) {
      throw new NotFoundException('Разрешение не найдено');
    }

    // Проверяем доступ к смете
    await this.checkWorkspaceAccess(
      permission.column.estimate.workspaceId,
      user,
    );

    const updated = await this.prisma.columnRolePermission.update({
      where: { id: permissionId },
      data: {
        ...(updatePermissionDto.canView !== undefined && {
          canView: updatePermissionDto.canView,
        }),
        ...(updatePermissionDto.canEdit !== undefined && {
          canEdit: updatePermissionDto.canEdit,
        }),
        ...(updatePermissionDto.canCreate !== undefined && {
          canCreate: updatePermissionDto.canCreate,
        }),
      },
      select: {
        id: true,
        columnId: true,
        role: true,
        canView: true,
        canEdit: true,
        canCreate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Логируем изменение разрешения
    const historyEntries: Array<{
      columnId: string;
      userId: string;
      action: ColumnHistoryAction;
      field: string;
      oldValue: string;
      newValue: string;
      metadata: string;
    }> = [];
    if (
      updatePermissionDto.canView !== undefined &&
      updatePermissionDto.canView !== permission.canView
    ) {
      historyEntries.push({
        columnId: permission.columnId,
        userId: user.id,
        action: ColumnHistoryAction.PERMISSION_CHANGED,
        field: `permission.${permission.role}.canView`,
        oldValue: String(permission.canView),
        newValue: String(updatePermissionDto.canView),
        metadata: JSON.stringify({
          permissionId: permission.id,
          role: permission.role,
        }),
      });
    }
    if (
      updatePermissionDto.canEdit !== undefined &&
      updatePermissionDto.canEdit !== permission.canEdit
    ) {
      historyEntries.push({
        columnId: permission.columnId,
        userId: user.id,
        action: ColumnHistoryAction.PERMISSION_CHANGED,
        field: `permission.${permission.role}.canEdit`,
        oldValue: String(permission.canEdit),
        newValue: String(updatePermissionDto.canEdit),
        metadata: JSON.stringify({
          permissionId: permission.id,
          role: permission.role,
        }),
      });
    }

    if (historyEntries.length > 0) {
      await this.prisma.columnHistory.createMany({
        data: historyEntries,
      });
    }

    return updated;
  }

  /**
   * Удаление разрешения на столбец для роли
   * @param permissionId - ID разрешения
   * @param user - текущий пользователь
   */
  async removeColumnPermission(
    permissionId: string,
    user: AuthenticatedUser,
  ): Promise<void> {
    // Только ADMIN и MANAGER могут управлять разрешениями
    if (user.role === Role.WORKER) {
      throw new ForbiddenException(
        'Работники не могут управлять разрешениями на столбцы',
      );
    }

    const permission = await this.prisma.columnRolePermission.findUnique({
      where: { id: permissionId },
      include: {
        column: {
          include: {
            estimate: true,
          },
        },
      },
    });

    if (!permission) {
      throw new NotFoundException('Разрешение не найдено');
    }

    // Проверяем доступ к смете
    await this.checkWorkspaceAccess(
      permission.column.estimate.workspaceId,
      user,
    );

    // Логируем удаление разрешения
    await this.prisma.columnHistory.create({
      data: {
        columnId: permission.columnId,
        userId: user.id,
        action: ColumnHistoryAction.PERMISSION_CHANGED,
        field: 'permission',
        oldValue: JSON.stringify({
          role: permission.role,
          canView: permission.canView,
          canEdit: permission.canEdit,
        }),
        newValue: null,
        metadata: JSON.stringify({
          permissionId: permission.id,
          role: permission.role,
        }),
      },
    });

    await this.prisma.columnRolePermission.delete({
      where: { id: permissionId },
    });
  }

  /**
   * Получение истории изменений столбца
   * @param columnId - ID столбца
   * @param user - текущий пользователь
   * @returns список записей истории
   */
  async getColumnHistory(
    columnId: string,
    user: AuthenticatedUser,
  ): Promise<ColumnHistoryType[]> {
    const column = await this.prisma.estimateColumn.findUnique({
      where: { id: columnId },
      include: {
        estimate: true,
      },
    });

    if (!column) {
      throw new NotFoundException('Столбец не найден');
    }

    // Проверяем доступ к смете
    await this.checkWorkspaceAccess(column.estimate.workspaceId, user);

    const history = await this.prisma.columnHistory.findMany({
      where: { columnId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return history.map((h) => ({
      id: h.id,
      columnId: h.columnId,
      userId: h.userId,
      action: h.action,
      field: h.field,
      oldValue: h.oldValue,
      newValue: h.newValue,
      metadata: h.metadata,
      createdAt: h.createdAt,
      user: h.user,
    }));
  }

  /**
   * Получение данных таблицы сметы (строки с ячейками)
   * С учетом прав доступа - только видимые столбцы
   * @param estimateId - ID сметы
   * @param user - текущий пользователь
   * @returns данные таблицы с учетом прав доступа
   */
  async getTableData(
    estimateId: string,
    user: AuthenticatedUser,
  ): Promise<EstimateTableData> {
    // Проверяем доступ к смете
    await this.findOne(estimateId, user);

    // Получаем все столбцы сметы
    const columns = await this.prisma.estimateColumn.findMany({
      where: {
        estimateId,
      },
      orderBy: {
        order: 'asc',
      },
    });

    // Получаем разрешения для текущей роли пользователя
    const permissions = await this.prisma.columnRolePermission.findMany({
      where: {
        columnId: { in: columns.map((c) => c.id) },
        role: user.role,
      },
    });

    const permissionMap = new Map(permissions.map((p) => [p.columnId, p]));

    // Фильтруем столбцы по правам доступа (canView)
    // ADMIN видит все столбцы
    const visibleColumns =
      user.role === Role.ADMIN
        ? columns
        : columns.filter((col) => {
            const permission = permissionMap.get(col.id);
            // Если разрешения нет - по умолчанию видим (для MANAGER)
            return permission ? permission.canView : user.role === Role.MANAGER;
          });

    // Определяем, какие столбцы можно редактировать
    const columnsWithPermissions = visibleColumns.map((col) => {
      const permission = permissionMap.get(col.id);
      let canEdit = false;

      if (user.role === Role.ADMIN) {
        canEdit = true; // ADMIN всегда может редактировать
      } else if (permission) {
        canEdit = permission.canEdit;
      } else {
        // По умолчанию MANAGER может редактировать, WORKER - нет
        canEdit = user.role === Role.MANAGER;
      }

      // Парсим allowedValues для ENUM типа
      let parsedAllowedValues: string[] | null = null;
      if (col.dataType === 'ENUM' && col.allowedValues) {
        try {
          const parsed: unknown = JSON.parse(col.allowedValues);
          // Проверяем что это массив строк
          if (
            Array.isArray(parsed) &&
            parsed.every((v) => typeof v === 'string')
          ) {
            parsedAllowedValues = parsed;
          }
        } catch {
          parsedAllowedValues = null;
        }
      }

      return {
        id: col.id,
        name: col.name,
        dataType: col.dataType,
        order: col.order,
        canEdit,
        allowedValues: parsedAllowedValues,
      };
    });

    // Получаем все строки сметы
    const rows = await this.prisma.estimateRow.findMany({
      where: {
        estimateId,
      },
      orderBy: {
        order: 'asc',
      },
    });

    // Получаем ячейки для всех строк и видимых столбцов
    const rowIds = rows.map((r) => r.id);
    const columnIds = visibleColumns.map((c) => c.id);

    const cells = await this.prisma.cell.findMany({
      where: {
        rowId: { in: rowIds },
        columnId: { in: columnIds },
      },
    });

    // Группируем ячейки по строкам
    const cellsByRow = new Map<string, typeof cells>();
    cells.forEach((cell) => {
      if (!cellsByRow.has(cell.rowId)) {
        cellsByRow.set(cell.rowId, []);
      }
      cellsByRow.get(cell.rowId)!.push(cell);
    });

    // Формируем строки с ячейками
    const rowsWithCells: EstimateRowWithCells[] = rows.map((row) => ({
      id: row.id,
      estimateId: row.estimateId,
      order: row.order,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      cells: (cellsByRow.get(row.id) || []).map((cell) => ({
        id: cell.id,
        rowId: cell.rowId,
        columnId: cell.columnId,
        value: cell.value,
        createdAt: cell.createdAt,
        updatedAt: cell.updatedAt,
      })),
    }));

    return {
      columns: columnsWithPermissions,
      rows: rowsWithCells,
    };
  }

  /**
   * Создание новой строки сметы
   * @param createRowDto - данные для создания строки
   * @param user - текущий пользователь
   * @returns созданная строка
   */
  async createRow(
    createRowDto: CreateEstimateRowDto,
    user: AuthenticatedUser,
  ): Promise<EstimateRowWithCells> {
    // Проверяем доступ к смете
    await this.findOne(createRowDto.estimateId, user);

    // Определяем порядок (если не указан - добавляем в конец)
    let order = createRowDto.order;
    if (order === undefined) {
      const maxOrder = await this.prisma.estimateRow.findFirst({
        where: {
          estimateId: createRowDto.estimateId,
        },
        orderBy: {
          order: 'desc',
        },
        select: {
          order: true,
        },
      });
      order = maxOrder ? maxOrder.order + 1 : 0;
    }

    // Создаем строку
    const row = await this.prisma.estimateRow.create({
      data: {
        estimateId: createRowDto.estimateId,
        order,
      },
    });

    // Создаем пустые ячейки для всех столбцов сметы
    const columns = await this.prisma.estimateColumn.findMany({
      where: {
        estimateId: createRowDto.estimateId,
      },
    });

    const cells = await Promise.all(
      columns.map((col) =>
        this.prisma.cell.create({
          data: {
            rowId: row.id,
            columnId: col.id,
            value: null,
          },
        }),
      ),
    );

    return {
      id: row.id,
      estimateId: row.estimateId,
      order: row.order,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      cells: cells.map((cell) => ({
        id: cell.id,
        rowId: cell.rowId,
        columnId: cell.columnId,
        value: cell.value,
        createdAt: cell.createdAt,
        updatedAt: cell.updatedAt,
      })),
    };
  }

  /**
   * Удаление строки сметы
   * @param rowId - ID строки
   * @param user - текущий пользователь
   */
  async removeRow(rowId: string, user: AuthenticatedUser): Promise<void> {
    // Получаем строку и проверяем доступ к смете
    const row = await this.prisma.estimateRow.findUnique({
      where: { id: rowId },
      include: {
        estimate: true,
      },
    });

    if (!row) {
      throw new NotFoundException('Строка не найдена');
    }

    await this.checkWorkspaceAccess(row.estimate.workspaceId, user);

    // Удаляем строку (ячейки удалятся каскадно)
    await this.prisma.estimateRow.delete({
      where: { id: rowId },
    });
  }

  /**
   * Обновление значения ячейки
   * @param cellId - ID ячейки
   * @param updateCellDto - данные для обновления
   * @param user - текущий пользователь
   * @returns обновленная ячейка
   */
  async updateCell(
    cellId: string,
    updateCellDto: UpdateCellDto,
    user: AuthenticatedUser,
  ): Promise<CellType> {
    // Получаем ячейку со столбцом и сметой
    const cell = await this.prisma.cell.findUnique({
      where: { id: cellId },
      include: {
        column: {
          include: {
            estimate: true,
          },
        },
      },
    });

    if (!cell) {
      throw new NotFoundException('Ячейка не найдена');
    }

    // Проверяем доступ к смете
    await this.checkWorkspaceAccess(cell.column.estimate.workspaceId, user);

    // Проверяем права на редактирование столбца
    if (user.role !== Role.ADMIN) {
      const permission = await this.prisma.columnRolePermission.findFirst({
        where: {
          columnId: cell.columnId,
          role: user.role,
        },
      });

      const canEdit = permission
        ? permission.canEdit
        : user.role === Role.MANAGER; // По умолчанию MANAGER может редактировать

      if (!canEdit) {
        throw new ForbiddenException(
          'У вас нет прав на редактирование этого столбца',
        );
      }
    }

    // Сохраняем старое значение для истории
    const oldValue = cell.value;

    // Обновляем ячейку
    const updatedCell = await this.prisma.cell.update({
      where: { id: cellId },
      data: {
        value: updateCellDto.value ?? null,
      },
    });

    // Логируем изменение в историю
    await this.prisma.cellHistory.create({
      data: {
        cellId: cell.id,
        userId: user.id,
        oldValue,
        newValue: updatedCell.value,
        reason: updateCellDto.reason ?? null,
      },
    });

    return {
      id: updatedCell.id,
      rowId: updatedCell.rowId,
      columnId: updatedCell.columnId,
      value: updatedCell.value,
      createdAt: updatedCell.createdAt,
      updatedAt: updatedCell.updatedAt,
    };
  }
}
