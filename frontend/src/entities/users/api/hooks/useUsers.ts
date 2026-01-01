/**
 * @file: useUsers.ts
 * @description: Хук для получения списка пользователей
 * @dependencies: @tanstack/react-query, queries, queryKeys
 * @created: 2025-01-XX
 */

import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../queries/getUsers';
import { usersKeys } from '../queryKeys';

/**
 * Хук для получения списка пользователей
 * @returns объект с данными, состоянием загрузки и ошибками
 */
export const useUsers = () => {
  return useQuery({
    queryKey: usersKeys.list.queryKey,
    queryFn: getUsers,
  });
};

