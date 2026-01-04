/**
 * @file: useUpdateColumnPermission.ts
 * @description: Хук для обновления разрешения на столбец
 * @dependencies: @tanstack/react-query, queries, queryKeys
 * @created: 2025-01-04
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateColumnPermission } from '../queries/updateColumnPermission';
import { estimatesKeys } from '../queryKeys';
import type { UpdateColumnPermissionDto } from '../dto/column-permission.dto';
import type { ColumnRolePermissionDto } from '../dto/column-permission.dto';

/**
 * Хук для обновления разрешения на столбец
 * @returns объект с функцией обновления и состоянием
 */
export const useUpdateColumnPermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      permissionId,
      data,
    }: {
      permissionId: string;
      data: UpdateColumnPermissionDto;
    }): Promise<ColumnRolePermissionDto> => {
      return updateColumnPermission(permissionId, data);
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
      // Инвалидируем кеш сметы
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

