/**
 * @file: DeleteEstimateButton.tsx
 * @description: Кнопка удаления сметы с модалкой подтверждения
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
import { useDeleteEstimate } from '@/entities/estimates';
import { useHasPermission, PERMISSIONS } from '@/features/permissions';
import type { EstimateDto } from '@/entities/estimates';

interface DeleteEstimateButtonProps {
  estimate: EstimateDto;
}

/**
 * Кнопка удаления сметы
 * Показывается только если у пользователя есть право ESTIMATES_DELETE
 */
export function DeleteEstimateButton({ estimate }: DeleteEstimateButtonProps) {
  const [open, setOpen] = useState(false);
  const { mutate: deleteEstimate, isPending } = useDeleteEstimate();
  const canDelete = useHasPermission(PERMISSIONS.ESTIMATES_DELETE);

  // Если нет прав - не показываем кнопку
  if (!canDelete) {
    return null;
  }

  const handleDelete = () => {
    deleteEstimate(estimate.id, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить смету?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены, что хотите удалить смету <strong>{estimate.name}</strong>?
            <br />
            Это действие нельзя отменить. Смета будет помечена как удаленная (мягкое удаление).
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

