/**
 * @file: useCreateUser.ts
 * @description: Хук для создания пользователя
 * @dependencies: @tanstack/react-query, queries, queryKeys
 * @created: 2025-01-XX
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser } from '../queries/createUser';
import { addUserToWorkspace } from '@/entities/workspaces/api/queries/addUserToWorkspace';
import { usersKeys } from '../queryKeys';
import { workspacesKeys } from '@/entities/workspaces/api';
import type { CreateUserDto } from '../dto/create-user.dto';
import type { UserDto } from '../dto/user.dto';

/**
 * Хук для создания пользователя
 * @returns объект с функцией создания и состоянием
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserDto): Promise<UserDto> => {
      // Создаем пользователя
      const user = await createUser(data);
      
      // Добавляем пользователя в выбранные workspaces
      if (data.workspaceIds && data.workspaceIds.length > 0) {
        await Promise.all(
          data.workspaceIds.map((workspaceId) =>
            addUserToWorkspace(workspaceId, user.id)
          )
        );
      }
      
      return user;
    },
    onSuccess: () => {
      // Инвалидируем кеш списка пользователей после создания
      queryClient.invalidateQueries({ queryKey: usersKeys.list.queryKey });
      // Также инвалидируем кеш workspaces, если пользователь был добавлен в проекты
      queryClient.invalidateQueries({ queryKey: workspacesKeys.list.queryKey });
    },
  });
};
