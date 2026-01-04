/**
 * @file: ColumnDetailsDialog.tsx
 * @description: Диалог просмотра деталей столбца
 * @created: 2025-01-04
 */

import { Info } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { Badge } from '@/shared/ui/badge';
import { useEstimateColumnFull, useColumnHistory } from '@/entities/estimates';
import { Skeleton } from '@/shared/ui/skeleton';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/shared/ui/collapsible';
import { History } from 'lucide-react';

interface ColumnDetailsDialogProps {
  columnId: string;
  columnName: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ColumnDetailsDialog({
  columnId,
  columnName,
  open,
  onOpenChange,
}: ColumnDetailsDialogProps) {
  const { data: column, isLoading, error } = useEstimateColumnFull(columnId);
  const { data: history, isLoading: isLoadingHistory } = useColumnHistory(columnId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Информация о столбце: {columnName}</DialogTitle>
          <DialogDescription>
            Детальная информация о столбце, создателе и разрешениях для ролей
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )}

        {error && (
          <div className="text-sm text-destructive">
            {error instanceof Error ? error.message : 'Не удалось загрузить информацию'}
          </div>
        )}

        {column && (
          <div className="space-y-6">
            {/* Основная информация */}
            <div>
              <h3 className="font-semibold mb-3">Основная информация</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Название:</span>
                  <span className="font-medium">{column.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Тип данных:</span>
                  <Badge variant="secondary">{column.dataType}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Порядок:</span>
                  <span className="font-medium">{column.order}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Обязательное:</span>
                  <span className="font-medium">{column.required ? 'Да' : 'Нет'}</span>
                </div>
                {column.dataType === 'ENUM' && column.allowedValues && (
                  <div>
                    <span className="text-muted-foreground">Разрешенные значения:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {JSON.parse(column.allowedValues).map((value: string, idx: number) => (
                        <Badge key={idx} variant="outline">
                          {value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Информация о создателе */}
            <div>
              <h3 className="font-semibold mb-3">Создатель</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-medium">{column.createdBy.email}</span>
                </div>
                {column.createdBy.firstName && column.createdBy.lastName && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Имя:</span>
                    <span className="font-medium">
                      {column.createdBy.firstName} {column.createdBy.lastName}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Создан:</span>
                  <span className="font-medium">
                    {new Date(column.createdAt).toLocaleString('ru-RU')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Обновлен:</span>
                  <span className="font-medium">
                    {new Date(column.updatedAt).toLocaleString('ru-RU')}
                  </span>
                </div>
              </div>
            </div>

            {/* Разрешения для ролей */}
            <div>
              <h3 className="font-semibold mb-3">Разрешения для ролей</h3>
              {column.rolePermissions.length > 0 ? (
                <div className="space-y-3">
                  {column.rolePermissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="border rounded-lg p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="font-medium">
                          {permission.role}
                        </Badge>
                        <div className="flex gap-2 text-xs">
                          <span
                            className={
                              permission.canView
                                ? 'text-green-600'
                                : 'text-muted-foreground'
                            }
                          >
                            {permission.canView ? '✓ Видеть' : '✗ Не видеть'}
                          </span>
                          <span
                            className={
                              permission.canEdit
                                ? 'text-green-600'
                                : 'text-muted-foreground'
                            }
                          >
                            {permission.canEdit ? '✓ Редактировать' : '✗ Не редактировать'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Разрешения для ролей не настроены. По умолчанию все роли могут видеть столбец.
                </p>
              )}
            </div>

            {/* История изменений */}
            <Collapsible defaultOpen={false}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg border hover:bg-accent transition-colors">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">История изменений</span>
                  {history && history.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {history.length}
                    </Badge>
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-2">
                {isLoadingHistory ? (
                  <div className="space-y-2">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ) : history && history.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {history.map((entry) => (
                      <div
                        key={entry.id}
                        className="border rounded-lg p-3 space-y-1 text-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                entry.action === 'CREATED'
                                  ? 'default'
                                  : entry.action === 'UPDATED'
                                    ? 'secondary'
                                    : 'outline'
                              }
                            >
                              {entry.action === 'CREATED'
                                ? 'Создан'
                                : entry.action === 'UPDATED'
                                  ? 'Изменен'
                                  : 'Разрешение изменено'}
                            </Badge>
                            {entry.field && (
                              <span className="text-muted-foreground">
                                {entry.field === 'name'
                                  ? 'Название'
                                  : entry.field === 'dataType'
                                    ? 'Тип данных'
                                    : entry.field === 'order'
                                      ? 'Порядок'
                                      : entry.field === 'required'
                                        ? 'Обязательность'
                                        : entry.field === 'allowedValues'
                                          ? 'Разрешенные значения'
                                          : entry.field.startsWith('permission.')
                                            ? `Разрешение (${entry.field.split('.')[1]})`
                                            : entry.field}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.createdAt).toLocaleString('ru-RU')}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {entry.user.firstName && entry.user.lastName
                            ? `${entry.user.firstName} ${entry.user.lastName}`
                            : entry.user.email}
                        </div>
                        {/* Отображение изменений для разрешений */}
                        {entry.action === 'PERMISSION_CHANGED' && (
                          <div className="mt-2 space-y-1 text-xs">
                            {entry.field?.startsWith('permission.') ? (
                              // Изменение конкретного поля разрешения
                              (() => {
                                const parts = entry.field.split('.');
                                const role = parts[1];
                                const field = parts[2];
                                const roleLabel =
                                  role === 'ADMIN'
                                    ? 'Администратор'
                                    : role === 'MANAGER'
                                      ? 'Менеджер'
                                      : 'Работник';
                                const fieldLabel = field === 'canView' ? 'Видимость' : 'Редактирование';
                                return (
                                  <>
                                    <div>
                                      <span className="font-medium">Роль:</span>{' '}
                                      <span className="text-muted-foreground">{roleLabel}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium">Параметр:</span>{' '}
                                      <span className="text-muted-foreground">{fieldLabel}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium">Было:</span>{' '}
                                      <span className="text-muted-foreground">
                                        {entry.oldValue === 'true' ? 'Разрешено' : 'Запрещено'}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="font-medium">Стало:</span>{' '}
                                      <span className="text-muted-foreground">
                                        {entry.newValue === 'true' ? 'Разрешено' : 'Запрещено'}
                                      </span>
                                    </div>
                                  </>
                                );
                              })()
                            ) : entry.field === 'permission' ? (
                              // Создание или удаление разрешения
                              (() => {
                                try {
                                  const metadata = entry.metadata
                                    ? JSON.parse(entry.metadata)
                                    : null;
                                  const role = metadata?.role || 'Неизвестно';
                                  const roleLabel =
                                    role === 'ADMIN'
                                      ? 'Администратор'
                                      : role === 'MANAGER'
                                        ? 'Менеджер'
                                        : 'Работник';

                                  if (entry.newValue === null) {
                                    // Удаление разрешения
                                    try {
                                      const oldData = entry.oldValue
                                        ? JSON.parse(entry.oldValue)
                                        : null;
                                      return (
                                        <>
                                          <div>
                                            <span className="font-medium">Роль:</span>{' '}
                                            <span className="text-muted-foreground">
                                              {roleLabel}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="font-medium">Действие:</span>{' '}
                                            <span className="text-destructive">
                                              Разрешение удалено
                                            </span>
                                          </div>
                                          {oldData && (
                                            <>
                                              <div>
                                                <span className="font-medium">Было видимость:</span>{' '}
                                                <span className="text-muted-foreground">
                                                  {oldData.canView ? 'Разрешено' : 'Запрещено'}
                                                </span>
                                              </div>
                                              <div>
                                                <span className="font-medium">Было редактирование:</span>{' '}
                                                <span className="text-muted-foreground">
                                                  {oldData.canEdit ? 'Разрешено' : 'Запрещено'}
                                                </span>
                                              </div>
                                            </>
                                          )}
                                        </>
                                      );
                                    } catch {
                                      return (
                                        <div>
                                          <span className="font-medium">Действие:</span>{' '}
                                          <span className="text-destructive">
                                            Разрешение удалено для роли {roleLabel}
                                          </span>
                                        </div>
                                      );
                                    }
                                  } else {
                                    // Создание разрешения
                                    try {
                                      const newData = entry.newValue
                                        ? JSON.parse(entry.newValue)
                                        : null;
                                      return (
                                        <>
                                          <div>
                                            <span className="font-medium">Роль:</span>{' '}
                                            <span className="text-muted-foreground">
                                              {roleLabel}
                                            </span>
                                          </div>
                                          <div>
                                            <span className="font-medium">Действие:</span>{' '}
                                            <span className="text-green-600">
                                              Разрешение создано
                                            </span>
                                          </div>
                                          {newData && (
                                            <>
                                              <div>
                                                <span className="font-medium">Видимость:</span>{' '}
                                                <span className="text-muted-foreground">
                                                  {newData.canView ? 'Разрешено' : 'Запрещено'}
                                                </span>
                                              </div>
                                              <div>
                                                <span className="font-medium">Редактирование:</span>{' '}
                                                <span className="text-muted-foreground">
                                                  {newData.canEdit ? 'Разрешено' : 'Запрещено'}
                                                </span>
                                              </div>
                                            </>
                                          )}
                                        </>
                                      );
                                    } catch {
                                      return (
                                        <div>
                                          <span className="font-medium">Действие:</span>{' '}
                                          <span className="text-green-600">
                                            Разрешение создано для роли {roleLabel}
                                          </span>
                                        </div>
                                      );
                                    }
                                  }
                                } catch {
                                  return (
                                    <div>
                                      <span className="font-medium">Действие:</span>{' '}
                                      <span className="text-muted-foreground">
                                        Изменение разрешения
                                      </span>
                                    </div>
                                  );
                                }
                              })()
                            ) : null}
                          </div>
                        )}
                        {/* Отображение изменений для обычных полей */}
                        {entry.action !== 'PERMISSION_CHANGED' &&
                          entry.oldValue !== null &&
                          entry.newValue !== null && (
                            <div className="mt-2 space-y-1 text-xs">
                              <div>
                                <span className="font-medium">Было:</span>{' '}
                                <span className="text-muted-foreground">
                                  {entry.field === 'allowedValues'
                                    ? entry.oldValue
                                      ? JSON.parse(entry.oldValue).join(', ')
                                      : '—'
                                    : entry.oldValue}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium">Стало:</span>{' '}
                                <span className="text-muted-foreground">
                                  {entry.field === 'allowedValues'
                                    ? entry.newValue
                                      ? JSON.parse(entry.newValue).join(', ')
                                      : '—'
                                    : entry.newValue}
                                </span>
                              </div>
                            </div>
                          )}
                        {entry.action === 'CREATED' && entry.newValue && (
                          <div className="mt-2 text-xs">
                            <span className="font-medium">Создан со значениями:</span>
                            <div className="text-muted-foreground mt-1">
                              {(() => {
                                try {
                                  const data = JSON.parse(entry.newValue);
                                  return Object.entries(data)
                                    .map(([key, value]) => {
                                      const label =
                                        key === 'name'
                                          ? 'Название'
                                          : key === 'dataType'
                                            ? 'Тип'
                                            : key === 'order'
                                              ? 'Порядок'
                                              : key === 'required'
                                                ? 'Обязательное'
                                                : key === 'allowedValues'
                                                  ? 'Разрешенные значения'
                                                  : key;
                                      return `${label}: ${
                                        Array.isArray(value)
                                          ? value.join(', ')
                                          : String(value)
                                      }`;
                                    })
                                    .join(', ');
                                } catch {
                                  return entry.newValue;
                                }
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    История изменений пуста
                  </p>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

