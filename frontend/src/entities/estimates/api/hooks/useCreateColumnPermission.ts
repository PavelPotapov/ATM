/**
 * @file: useCreateColumnPermission.ts
 * @description: Хук для создания разрешения на столбец
 * @dependencies: @tanstack/react-query, queries, queryKeys
 * @created: 2025-01-04
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createColumnPermission } from '../queries/createColumnPermission';
import { estimatesKeys } from '../queryKeys';
import type { CreateColumnPermissionDto } from '../dto/column-permission.dto';
import type { ColumnRolePermissionDto } from '../dto/column-permission.dto';

/**
 * Хук для создания разрешения на столбец
 * @returns объект с функцией создания и состоянием
 */
export const useCreateColumnPermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateColumnPermissionDto): Promise<ColumnRolePermissionDto> => {
      return createColumnPermission(data);
    },
    onSuccess: (data) => {
      // Инвалидируем кеш полной информации о столбце
      queryClient.invalidateQueries({
        queryKey: [...estimatesKeys.column(data.columnId).queryKey, 'full'],
      });
      // Инвалидируем кеш истории изменений столбца
      queryClient.invalidateQueries({
        queryKey: [...estimatesKeys.column(data.columnId).queryKey, 'history'],
      });
      // Инвалидируем кеш сметы (чтобы обновились столбцы)
      queryClient.invalidateQueries({
        predicate: (query) => {
          return (
            query.queryKey[0] === 'estimates' &&
            query.queryKey[1] === 'detail'
          );
        },
      });
    },
  });
};

