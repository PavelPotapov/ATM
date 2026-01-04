/**
 * @file: permissions.service.ts
 * @description: Сервис для определения разрешений пользователя на основе роли
 * @created: 2025-01-XX
 */

import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import {
  Permission,
  PermissionsList,
  PERMISSIONS,
} from '../types/permissions.types';

/**
 * Сервис для работы с разрешениями пользователей
 */
@Injectable()
export class PermissionsService {
  /**
   * Получить список разрешений для роли
   * @param role - роль пользователя
   * @returns список разрешений
   */
  getPermissionsByRole(role: Role): PermissionsList {
    switch (role) {
      case Role.ADMIN:
        return this.getAdminPermissions();
      case Role.MANAGER:
        return this.getManagerPermissions();
      case Role.WORKER:
        return this.getWorkerPermissions();
      default:
        return [];
    }
  }

  /**
   * Разрешения для ADMIN (полный доступ)
   */
  private getAdminPermissions(): PermissionsList {
    return [
      // Workspaces - полный доступ
      PERMISSIONS.WORKSPACES_CREATE,
      PERMISSIONS.WORKSPACES_UPDATE,
      PERMISSIONS.WORKSPACES_DELETE,
      PERMISSIONS.WORKSPACES_DELETE_PERMANENT,
      PERMISSIONS.WORKSPACES_RESTORE,
      PERMISSIONS.WORKSPACES_ADD_USER,
      PERMISSIONS.WORKSPACES_REMOVE_USER,
      PERMISSIONS.WORKSPACES_VIEW_HISTORY,

      // Users - полный доступ
      PERMISSIONS.USERS_CREATE,
      PERMISSIONS.USERS_UPDATE,
      PERMISSIONS.USERS_DELETE,
      PERMISSIONS.USERS_VIEW,

      // Estimates - полный доступ
      PERMISSIONS.ESTIMATES_CREATE,
      PERMISSIONS.ESTIMATES_UPDATE,
      PERMISSIONS.ESTIMATES_DELETE,
      PERMISSIONS.ESTIMATES_VIEW,
    ];
  }

  /**
   * Разрешения для MANAGER (управление своими workspace)
   */
  private getManagerPermissions(): PermissionsList {
    return [
      // Workspaces - управление своими workspace
      PERMISSIONS.WORKSPACES_CREATE,
      PERMISSIONS.WORKSPACES_UPDATE,
      PERMISSIONS.WORKSPACES_DELETE,
      PERMISSIONS.WORKSPACES_RESTORE,
      PERMISSIONS.WORKSPACES_ADD_USER,
      PERMISSIONS.WORKSPACES_REMOVE_USER,
      PERMISSIONS.WORKSPACES_VIEW_HISTORY,
      // НЕТ: WORKSPACES_DELETE_PERMANENT (только ADMIN)
      // НЕТ: все разрешения для users

      // Estimates - управление сметами в своих workspace
      PERMISSIONS.ESTIMATES_CREATE,
      PERMISSIONS.ESTIMATES_UPDATE,
      PERMISSIONS.ESTIMATES_DELETE,
      PERMISSIONS.ESTIMATES_VIEW,
    ];
  }

  /**
   * Разрешения для WORKER (только просмотр)
   */
  private getWorkerPermissions(): PermissionsList {
    return [
      // Workspaces - только просмотр истории
      PERMISSIONS.WORKSPACES_VIEW_HISTORY,
      // НЕТ: все остальные разрешения

      // Estimates - только просмотр
      PERMISSIONS.ESTIMATES_VIEW,
      // НЕТ: CREATE, UPDATE, DELETE
    ];
  }

  /**
   * Проверить, есть ли у пользователя конкретное разрешение
   * @param role - роль пользователя
   * @param permission - проверяемое разрешение
   * @returns true если разрешение есть
   */
  hasPermission(role: Role, permission: Permission): boolean {
    const permissions = this.getPermissionsByRole(role);
    return permissions.includes(permission);
  }
}
