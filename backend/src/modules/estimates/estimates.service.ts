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
import {
  EstimateWithTimestamps,
  EstimateWithCreator,
  EstimateWithColumns,
  EstimateFull,
} from './types/estimate.types';
import { AuthenticatedUser } from '../users/types/user.types';
import { Role } from '@prisma/client';

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
    const estimate = await this.findOne(id, user);

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
    const estimate = await this.findOne(id, user);

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
    const estimate = await this.findOne(createColumnDto.estimateId, user);

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
      (updateColumnDto.dataType === 'ENUM' ||
        column.dataType === 'ENUM') &&
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
}

