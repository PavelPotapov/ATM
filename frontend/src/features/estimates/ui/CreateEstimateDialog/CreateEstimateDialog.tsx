/**
 * @file: CreateEstimateDialog.tsx
 * @description: Диалог создания сметы
 * @created: 2025-01-04
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Textarea } from '@/shared/ui/textarea';
import { useCreateEstimate, type CreateEstimateDto } from '@/entities/estimates';
import { useHasPermission, PERMISSIONS } from '@/features/permissions';

interface CreateEstimateDialogProps {
  workspaceId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateEstimateDialog({
  workspaceId,
  open,
  onOpenChange,
}: CreateEstimateDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const { mutate: createEstimate, isPending } = useCreateEstimate();
  const canCreate = useHasPermission(PERMISSIONS.ESTIMATES_CREATE);

  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange : setInternalOpen;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Omit<CreateEstimateDto, 'workspaceId'>>({
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // Сбрасываем форму при открытии диалога
  useEffect(() => {
    if (dialogOpen) {
      reset({
        name: '',
        description: '',
      });
    }
  }, [dialogOpen, reset]);

  const onSubmit = (data: Omit<CreateEstimateDto, 'workspaceId'>) => {
    createEstimate(
      {
        workspaceId, // Используем workspaceId из props
        name: data.name,
        description: data.description || undefined,
      },
      {
        onSuccess: () => {
          if (isControlled && onOpenChange) {
            onOpenChange(false);
          } else {
            setInternalOpen(false);
          }
          reset();
        },
      },
    );
  };

  // Если нет прав - не показываем компонент
  if (!canCreate) {
    return null;
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Создать смету
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать новую смету</DialogTitle>
          <DialogDescription>
            Заполните форму для создания новой сметы проекта
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Название сметы <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              {...register('name', {
                required: 'Название сметы обязательно',
                minLength: {
                  value: 1,
                  message: 'Название не может быть пустым',
                },
                maxLength: {
                  value: 255,
                  message: 'Название не может быть длиннее 255 символов',
                },
              })}
              placeholder="Например: Смета на строительство офисного здания"
              disabled={isPending}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              {...register('description', {
                maxLength: {
                  value: 1000,
                  message: 'Описание не может быть длиннее 1000 символов',
                },
              })}
              placeholder="Описание сметы (опционально)"
              rows={3}
              disabled={isPending}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (isControlled && onOpenChange) {
                  onOpenChange(false);
                } else {
                  setInternalOpen(false);
                }
              }}
              disabled={isPending}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Создание...' : 'Создать'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

