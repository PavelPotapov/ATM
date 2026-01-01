/**
 * @file: create-user.dto.ts
 * @description: DTO для создания пользователя
 * @created: 2025-01-XX
 */

export interface CreateUserDto {
  login: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: 'ADMIN' | 'MANAGER' | 'WORKER';
  workspaceIds?: string[]; // Массив ID проектов для добавления пользователя
}
