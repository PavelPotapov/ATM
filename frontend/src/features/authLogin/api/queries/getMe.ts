/**
 * @file: getMe.ts
 * @description: Запрос для получения текущего пользователя
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-XX
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';
import type { AuthResponse } from '../dto/auth.dto';

/**
 * Получить информацию о текущем пользователе
 * @returns данные текущего пользователя
 */
export const getMe = async (): Promise<AuthResponse['user']> => {
  const response = await apiClient.get<AuthResponse['user']>(API_ENDPOINTS.AUTH.ME);
  return response.data;
};

