/**
 * @file: useUser.ts
 * @description: Хук для получения данных текущего пользователя
 * @dependencies: @tanstack/react-query, queryKeys
 * @created: 2025-01-XX
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { authKeys } from '../queryKeys';
import type { AuthResponse } from '../dto/auth.dto';

/**
 * Хук для получения данных текущего пользователя из query cache
 * Данные устанавливаются через queryClient.setQueryData после логина
 * @returns данные пользователя или null
 */
export const useUser = () => {
  const queryClient = useQueryClient();
  
  // Используем useQuery с enabled: false для чтения из кеша
  // Это позволяет React отслеживать изменения в кеше
  const { data } = useQuery<AuthResponse['user'] | null>({
    queryKey: authKeys.user.queryKey,
    queryFn: () => {
      return queryClient.getQueryData<AuthResponse['user']>(authKeys.user.queryKey) ?? null;
    },
    enabled: false, // Не выполняем запрос, только читаем из кеша
    staleTime: Infinity,
    gcTime: Infinity,
    initialData: () => {
      return queryClient.getQueryData<AuthResponse['user']>(authKeys.user.queryKey) ?? null;
    },
  });
  
  return data ?? null;
};

