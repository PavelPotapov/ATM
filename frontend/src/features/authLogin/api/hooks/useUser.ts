/**
 * @file: useUser.ts
 * @description: Хук для получения данных текущего пользователя
 * @dependencies: @tanstack/react-query, queryKeys
 * @created: 2025-01-XX
 */

import { useQuery } from '@tanstack/react-query';
import { authKeys } from '../queryKeys';
import { getMe } from '../queries/getMe';
import { hasAccessToken } from '@/shared/lib/storage/jwtTokenStorage';
import type { AuthResponse } from '../dto/auth.dto';

/**
 * Хук для получения данных текущего пользователя
 * Если данных нет в кеше и есть токен, делает запрос на сервер
 * @returns данные пользователя или null
 */
export const useUser = () => {
  const { data } = useQuery<AuthResponse['user'] | null>({
    queryKey: authKeys.user.queryKey,
    queryFn: getMe,
    enabled: hasAccessToken(), // Запрос выполняется только если есть токен
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: Infinity, // Не удаляем из кеша
    retry: false, // Не повторяем запрос при ошибке (401 обработается в axios interceptor)
  });
  
  return data ?? null;
};
