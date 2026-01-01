/**
 * @file: useLogout.ts
 * @description: Хук для выхода из системы
 * @dependencies: @tanstack/react-query, queries
 * @created: 2025-01-XX
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../queries/logout';
import { clearTokens } from '@/shared/lib/storage/jwtTokenStorage';
import { authKeys } from '@/features/authLogin/api/queryKeys';
import { ROUTES } from '@/shared/config/routes.config';
import { router } from '@/app/router';

/**
 * Хук для выхода из системы
 * @returns объект мутации для выполнения logout
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Очищаем токены
      clearTokens();
      // Удаляем данные пользователя из query cache
      queryClient.removeQueries({ queryKey: authKeys.user.queryKey });
      // Очищаем весь кеш (опционально, можно очистить только связанные queries)
      queryClient.clear();
      // Редирект на страницу логина
      router.navigate({ to: ROUTES.LOGIN });
    },
    onError: () => {
      // Даже если запрос не удался, очищаем локальные данные
      clearTokens();
      queryClient.removeQueries({ queryKey: authKeys.user.queryKey });
      queryClient.clear();
      router.navigate({ to: ROUTES.LOGIN });
    },
  });
};

