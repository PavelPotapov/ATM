/**
 * @file: useDeleteUser.ts
 * @description: Хук для удаления пользователя
 * @dependencies: @tanstack/react-query, queries, queryKeys
 * @created: 2025-01-XX
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser } from '../queries/deleteUser';
import { usersKeys } from '../queryKeys';

/**
 * Хук для удаления пользователя
 * @returns объект с функцией удаления и состоянием
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      // Инвалидируем кеш списка пользователей после удаления
      queryClient.invalidateQueries({ queryKey: usersKeys.list.queryKey });
    },
  });
};
