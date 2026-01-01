/**
 * @file: logout.ts
 * @description: Запрос для выхода из системы
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-XX
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';

/**
 * Выход из системы
 * @returns сообщение об успешном выходе
 */
export const logout = async (): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>(
    API_ENDPOINTS.AUTH.LOGOUT
  );
  return response.data;
};
