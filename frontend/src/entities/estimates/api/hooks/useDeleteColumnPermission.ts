/**
 * @file: useDeleteColumnPermission.ts
 * @description: Хук для удаления разрешения на столбец
 * @dependencies: @tanstack/react-query, queries, queryKeys
 * @created: 2025-01-04
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteColumnPermission } from '../queries/deleteColumnPermission';
import { estimatesKeys } from '../queryKeys';

/**
 * Хук для удаления разрешения на столбец
 * @returns объект с функцией удаления и состоянием
 */
export const useDeleteColumnPermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      permissionId,
      columnId,
    }: {
      permissionId: string;
      columnId: string;
    }): Promise<void> => {
      return deleteColumnPermission(permissionId);
    },
    onSuccess: (_, { columnId }) => {
      // Инвалидируем кеш полной информации о столбце
      queryClient.invalidateQueries({
        queryKey: [...estimatesKeys.column(columnId).queryKey, 'full'],
      });
      // Инвалидируем кеш истории изменений столбца
      queryClient.invalidateQueries({
        queryKey: [...estimatesKeys.column(columnId).queryKey, 'history'],
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

