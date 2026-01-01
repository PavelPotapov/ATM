/**
 * @file: usePermissions.ts
 * @description: Хук для получения списка разрешений пользователя
 * @dependencies: @tanstack/react-query, queries, queryKeys
 * @created: 2025-01-XX
 */

import { useQuery } from '@tanstack/react-query';
import { getPermissions } from '../queries/getPermissions';
import { permissionsKeys } from '../queryKeys';
import { hasAccessToken } from '@/shared/lib/storage/jwtTokenStorage';
import type { Permission } from '../../types/permissions.types';

/**
 * Хук для получения списка разрешений пользователя
 * @returns объект с данными, состоянием загрузки и ошибками
 */
export const usePermissions = () => {
  return useQuery({
    queryKey: permissionsKeys.list.queryKey,
    queryFn: getPermissions,
    enabled: hasAccessToken(),
    staleTime: 5 * 60 * 1000, // 5 минут - разрешения не меняются часто
    retry: false,
  });
};

/**
 * Хук для проверки наличия конкретного разрешения
 * @param permission - проверяемое разрешение (типизированное)
 * @returns true если разрешение есть, false если нет или еще загружается
 */
export const useHasPermission = (permission: Permission): boolean => {
  const { data: permissions, isLoading } = usePermissions();
  if (isLoading) return false;
  return permissions?.includes(permission) ?? false;
};
