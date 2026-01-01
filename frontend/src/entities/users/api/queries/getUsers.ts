/**
 * @file: getUsers.ts
 * @description: Запрос для получения списка пользователей
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-XX
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';
import type { UserDto } from '../dto/user.dto';

/**
 * Получить список всех пользователей
 * @returns список пользователей
 */
export const getUsers = async (): Promise<UserDto[]> => {
  const response = await apiClient.get<UserDto[]>(API_ENDPOINTS.USERS.LIST);
  return response.data;
};

