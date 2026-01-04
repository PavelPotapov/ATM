/**
 * @file: useUpdateCell.ts
 * @description: Хук для обновления ячейки
 * @dependencies: @tanstack/react-query, queries, queryKeys
 * @created: 2025-01-04
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCell } from '../queries/updateCell';
import { estimatesKeys } from '../queryKeys';
import type {
  UpdateCellDto,
  EstimateTableCellDto,
  EstimateTableDataDto,
} from '../dto/estimate-table.dto';

/**
 * Хук для обновления ячейки
 * @returns объект с функцией обновления и состоянием
 */
export const useUpdateCell = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cellId,
      estimateId,
      data,
    }: {
      cellId: string;
      estimateId: string;
      data: UpdateCellDto;
    }): Promise<EstimateTableCellDto> => {
      return updateCell(cellId, data);
    },
    onMutate: async ({ estimateId, data, cellId }) => {
      // Отменяем исходящие запросы, чтобы они не перезаписали оптимистичное обновление
      await queryClient.cancelQueries({
        queryKey: estimatesKeys.table(estimateId).queryKey,
      });

      // Сохраняем предыдущее значение для отката
      const previousData = queryClient.getQueryData<EstimateTableDataDto>(
        estimatesKeys.table(estimateId).queryKey,
      );

      // Оптимистично обновляем данные
      if (previousData) {
        // Если есть rowId и columnId - обновляем конкретную ячейку
        if (data.rowId && data.columnId) {
          const updatedData: EstimateTableDataDto = {
            ...previousData,
            rows: previousData.rows.map((row) => {
              // Находим нужную строку
              if (row.id === data.rowId) {
                // Обновляем или создаем ячейку
                const cellIndex = row.cells.findIndex(
                  (cell) => cell.columnId === data.columnId,
                );

                const updatedCell: EstimateTableCellDto = {
                  id: cellId === 'new' ? 'temp-' + Date.now() : cellId,
                  rowId: data.rowId,
                  columnId: data.columnId,
                  value: data.value ?? null,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };

                if (cellIndex >= 0) {
                  // Обновляем существующую ячейку
                  return {
                    ...row,
                    cells: row.cells.map((cell, idx) =>
                      idx === cellIndex ? updatedCell : cell,
                    ),
                  };
                } else {
                  // Добавляем новую ячейку
                  return {
                    ...row,
                    cells: [...row.cells, updatedCell],
                  };
                }
              }
              return row;
            }),
          };

          queryClient.setQueryData(
            estimatesKeys.table(estimateId).queryKey,
            updatedData,
          );
        } else if (cellId && cellId !== 'new') {
          // Если есть только cellId (старый формат) - находим ячейку по ID
          const updatedData: EstimateTableDataDto = {
            ...previousData,
            rows: previousData.rows.map((row) => {
              const cellIndex = row.cells.findIndex((cell) => cell.id === cellId);
              if (cellIndex >= 0) {
                return {
                  ...row,
                  cells: row.cells.map((cell, idx) =>
                    idx === cellIndex
                      ? {
                          ...cell,
                          value: data.value ?? null,
                          updatedAt: new Date().toISOString(),
                        }
                      : cell,
                  ),
                };
              }
              return row;
            }),
          };

          queryClient.setQueryData(
            estimatesKeys.table(estimateId).queryKey,
            updatedData,
          );
        }
      }

      // Возвращаем контекст с предыдущими данными для отката
      return { previousData };
    },
    onError: (err, variables, context) => {
      // Откатываем изменения при ошибке
      if (context?.previousData) {
        queryClient.setQueryData(
          estimatesKeys.table(variables.estimateId).queryKey,
          context.previousData,
        );
      }
    },
    onSettled: (data, error, variables) => {
      // После завершения (успех или ошибка) обновляем данные с сервера
      // Но не инвалидируем полностью, чтобы сохранить пагинацию
      queryClient.invalidateQueries({
        queryKey: estimatesKeys.table(variables.estimateId).queryKey,
      });
    },
  });
};

