/**
 * @file: createUser.ts
 * @description: Запрос для создания пользователя
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-XX
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';
import type { CreateUserDto } from '../dto/create-user.dto';
import type { UserDto } from '../dto/user.dto';

/**
 * Создать нового пользователя
 * @param data - данные для создания пользователя
 * @returns созданный пользователь
 */
export const createUser = async (data: CreateUserDto): Promise<UserDto> => {
  // Временно используем login как email для совместимости с бэкендом
  // TODO: Обновить бэкенд для поддержки login
  const response = await apiClient.post<UserDto>(API_ENDPOINTS.USERS.CREATE, {
    email: `${data.login}@system.local`, // Временный email на основе login
    password: data.password, // Пароль, введенный или сгенерированный админом
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role,
  });
  return response.data;
};
