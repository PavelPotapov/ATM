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
    onSettled: () => {
      // Независимо от результата: очищаем токены, кэш и редиректим
      clearTokens();
      queryClient.removeQueries({ queryKey: authKeys.user.queryKey });
      queryClient.clear();
      router.navigate({ to: ROUTES.LOGIN });
    },
  });
};

