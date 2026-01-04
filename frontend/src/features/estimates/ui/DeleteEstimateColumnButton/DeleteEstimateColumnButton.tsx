/**
 * @file: DeleteEstimateColumnButton.tsx
 * @description: Кнопка удаления столбца сметы с модалкой подтверждения
 * @created: 2025-01-04
 */

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/shared/ui/alertDialog';
import { useDeleteEstimateColumn } from '@/entities/estimates';
import { useHasPermission, PERMISSIONS } from '@/features/permissions';

interface DeleteEstimateColumnButtonProps {
  columnId: string;
  columnName: string;
  estimateId: string;
}

/**
 * Кнопка удаления столбца сметы
 * Показывается только если у пользователя есть право ESTIMATES_DELETE
 */
export function DeleteEstimateColumnButton({
  columnId,
  columnName,
  estimateId,
}: DeleteEstimateColumnButtonProps) {
  const [open, setOpen] = useState(false);
  const { mutate: deleteColumn, isPending } = useDeleteEstimateColumn();
  const canDelete = useHasPermission(PERMISSIONS.ESTIMATES_DELETE);

  // Если нет прав - не показываем кнопку
  if (!canDelete) {
    return null;
  }

  const handleDelete = () => {
    deleteColumn(
      {
        columnId,
        estimateId,
      },
      {
        onSuccess: () => {
          setOpen(false);
        },
      },
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить столбец?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены, что хотите удалить столбец <strong>{columnName}</strong>?
            <br />
            Это действие нельзя отменить. Все данные в этом столбце будут удалены.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Отмена</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? 'Удаление...' : 'Удалить'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

