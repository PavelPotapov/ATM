/**
 * @file: useLogin.ts
 * @description: Хук для входа в систему
 * @dependencies: @tanstack/react-query, queries
 * @created: 2025-01-XX
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../queries/login';
import { setAccessToken, setRefreshToken } from '@/shared/lib/storage/jwtTokenStorage';
import { authKeys } from '../queryKeys';
import { ROUTES } from '@/shared/config/routes.config';
import { router } from '@/app/router';

/**
 * Хук для входа в систему
 * @returns объект мутации для выполнения логина
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Сохраняем access token и refresh token в localStorage
      setAccessToken(data.access_token);
      setRefreshToken(data.refresh_token);
      // Сохраняем данные пользователя в query cache
      queryClient.setQueryData(authKeys.user.queryKey, data.user);
      // Редирект на защищенную страницу workspaces
      router.navigate({ to: ROUTES.WORKSPACES });
    },
  });
};

