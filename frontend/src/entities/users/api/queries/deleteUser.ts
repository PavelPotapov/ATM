/**
 * @file: deleteUser.ts
 * @description: Запрос для удаления пользователя
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-XX
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';

/**
 * Удалить пользователя по ID
 * @param id - ID пользователя
 */
export const deleteUser = async (id: string): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
};
