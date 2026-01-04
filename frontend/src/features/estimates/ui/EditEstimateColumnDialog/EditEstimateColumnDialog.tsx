/**
 * @file: EditEstimateColumnDialog.tsx
 * @description: Диалог редактирования столбца сметы
 * @created: 2025-01-04
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Pencil } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import {
  useUpdateEstimateColumn,
  useEstimateColumnFull,
  type UpdateEstimateColumnDto,
  type ColumnDataType,
} from '@/entities/estimates';
import { useHasPermission, PERMISSIONS } from '@/features/permissions';

interface EditEstimateColumnDialogProps {
  columnId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const COLUMN_DATA_TYPES: { value: ColumnDataType; label: string }[] = [
  { value: 'STRING', label: 'Строка' },
  { value: 'NUMBER', label: 'Число' },
  { value: 'ENUM', label: 'Перечисление' },
  { value: 'BOOLEAN', label: 'Булево значение' },
  { value: 'DATE', label: 'Дата' },
];

export function EditEstimateColumnDialog({
  columnId,
  open,
  onOpenChange,
}: EditEstimateColumnDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const { data: column, isLoading: isLoadingColumn } = useEstimateColumnFull(columnId);
  const { mutate: updateColumn, isPending } = useUpdateEstimateColumn();
  const canUpdate = useHasPermission(PERMISSIONS.ESTIMATES_UPDATE);

  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange : setInternalOpen;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<UpdateEstimateColumnDto & { allowedValuesString?: string }>({
    defaultValues: {
      name: '',
      dataType: 'STRING',
      order: 0,
      required: false,
      allowedValuesString: '',
    },
  });

  const dataType = watch('dataType');

  // Заполняем форму данными столбца при загрузке
  useEffect(() => {
    if (column && dialogOpen) {
      const allowedValues = column.allowedValues
        ? JSON.parse(column.allowedValues).join(', ')
        : '';
      reset({
        name: column.name,
        dataType: column.dataType,
        order: column.order,
        required: column.required,
        allowedValuesString: allowedValues,
      });
    }
  }, [column, dialogOpen, reset]);

  const onSubmit = (data: UpdateEstimateColumnDto & { allowedValuesString?: string }) => {
    // Парсим allowedValuesString для ENUM типа
    let allowedValues: string[] | undefined = undefined;
    if (data.dataType === 'ENUM' && data.allowedValuesString) {
      allowedValues = data.allowedValuesString
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
      if (allowedValues.length === 0) {
        allowedValues = undefined;
      }
    }

    updateColumn(
      {
        columnId,
        data: {
          name: data.name,
          dataType: data.dataType,
          order: data.order,
          required: data.required,
          allowedValues,
        },
      },
      {
        onSuccess: () => {
          // Инвалидируем кеш полной информации о столбце, чтобы форма обновилась
          if (isControlled && onOpenChange) {
            onOpenChange(false);
          } else {
            setInternalOpen(false);
          }
        },
      },
    );
  };

  // Если нет прав - не показываем компонент
  if (!canUpdate) {
    return null;
  }

  if (isLoadingColumn) {
    return null;
  }

  if (!column) {
    return null;
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Редактировать столбец</DialogTitle>
          <DialogDescription>
            Измените параметры столбца сметы
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Название столбца <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              {...register('name', {
                required: 'Название столбца обязательно',
                minLength: {
                  value: 1,
                  message: 'Название не может быть пустым',
                },
                maxLength: {
                  value: 255,
                  message: 'Название не может быть длиннее 255 символов',
                },
              })}
              disabled={isPending}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dataType">
              Тип данных <span className="text-destructive">*</span>
            </Label>
            <Select
              value={dataType}
              onValueChange={(value) => setValue('dataType', value as ColumnDataType)}
              disabled={isPending}
            >
              <SelectTrigger id="dataType">
                <SelectValue placeholder="Выберите тип данных" />
              </SelectTrigger>
              <SelectContent>
                {COLUMN_DATA_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {dataType === 'ENUM' && (
            <div className="space-y-2">
              <Label htmlFor="allowedValues">
                Разрешенные значения (через запятую)
              </Label>
              <Input
                id="allowedValues"
                {...register('allowedValuesString')}
                placeholder="Например: м, м2, шт, л"
                disabled={isPending}
              />
              <p className="text-xs text-muted-foreground">
                Укажите значения через запятую. Например: м, м2, шт, л
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="order">
              Порядок отображения <span className="text-destructive">*</span>
            </Label>
            <Input
              id="order"
              type="number"
              {...register('order', {
                required: 'Порядок обязателен',
                min: { value: 0, message: 'Порядок не может быть отрицательным' },
                valueAsNumber: true,
              })}
              disabled={isPending}
            />
            {errors.order && (
              <p className="text-sm text-destructive">{errors.order.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="required"
              {...register('required')}
              disabled={isPending}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="required" className="cursor-pointer">
              Обязательное поле
            </Label>
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
              {isPending ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

