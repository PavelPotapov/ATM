/**
 * @file: addUserToWorkspace.ts
 * @description: Запрос для добавления пользователя в workspace
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-XX
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';

interface AddUserToWorkspaceDto {
  userId: string;
}

/**
 * Добавить пользователя в workspace
 * @param workspaceId - ID workspace
 * @param userId - ID пользователя
 */
export const addUserToWorkspace = async (
  workspaceId: string,
  userId: string,
): Promise<void> => {
  await apiClient.post(
    API_ENDPOINTS.WORKSPACES.ADD_USER(workspaceId),
    { userId } as AddUserToWorkspaceDto,
  );
};
