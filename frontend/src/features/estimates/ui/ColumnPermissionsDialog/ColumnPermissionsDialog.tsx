/**
 * @file: ColumnPermissionsDialog.tsx
 * @description: Диалог настройки разрешений столбца для ролей
 * @created: 2025-01-04
 */

import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
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
import { Label } from '@/shared/ui/label';
import {
  useEstimateColumnFull,
  useCreateColumnPermission,
  useUpdateColumnPermission,
  useDeleteColumnPermission,
  type Role,
  type CreateColumnPermissionDto,
} from '@/entities/estimates';
import { useHasPermission, PERMISSIONS } from '@/features/permissions';
import { useUser } from '@/features/authLogin/api';

interface ColumnPermissionsDialogProps {
  columnId: string;
  columnName: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface LocalPermissionState {
  canView: boolean;
  canEdit: boolean;
}

export function ColumnPermissionsDialog({
  columnId,
  columnName,
  open,
  onOpenChange,
}: ColumnPermissionsDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const { data: column, isLoading } = useEstimateColumnFull(columnId);
  const { mutate: createPermission, isPending: isCreating } = useCreateColumnPermission();
  const { mutate: updatePermission, isPending: isUpdating } = useUpdateColumnPermission();
  const { mutate: deletePermission, isPending: isDeleting } = useDeleteColumnPermission();
  const canManage = useHasPermission(PERMISSIONS.ESTIMATES_UPDATE);
  const currentUser = useUser();

  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange : setInternalOpen;

  const isPending = isCreating || isUpdating || isDeleting;

  // Локальное состояние для разрешений (изменения не применяются сразу)
  const [localPermissions, setLocalPermissions] = useState<{
    MANAGER?: LocalPermissionState;
    WORKER?: LocalPermissionState;
  }>({});

  // Инициализируем локальное состояние при загрузке данных
  useEffect(() => {
    if (column && dialogOpen) {
      const manager = column.rolePermissions.find((p) => p.role === 'MANAGER');
      const worker = column.rolePermissions.find((p) => p.role === 'WORKER');
      setLocalPermissions({
        MANAGER: manager
          ? { canView: manager.canView, canEdit: manager.canEdit }
          : { canView: true, canEdit: false }, // По умолчанию
        WORKER: worker
          ? { canView: worker.canView, canEdit: worker.canEdit }
          : { canView: true, canEdit: false }, // По умолчанию
      });
    }
  }, [column, dialogOpen]);

  // Если нет прав - не показываем компонент
  if (!canManage) {
    return null;
  }

  // Получаем разрешения для каждой роли (из локального состояния или из данных)
  const getPermissionForRole = (role: 'MANAGER' | 'WORKER') => {
    if (localPermissions[role]) {
      return localPermissions[role];
    }
    const permission = column?.rolePermissions.find((p) => p.role === role);
    return permission
      ? { canView: permission.canView, canEdit: permission.canEdit }
      : { canView: true, canEdit: false };
  };

  // Обработчик изменения локального состояния
  const handleLocalPermissionChange = (
    role: 'MANAGER' | 'WORKER',
    field: 'canView' | 'canEdit',
    value: boolean,
  ) => {
    setLocalPermissions((prev) => ({
      ...prev,
      [role]: {
        ...getPermissionForRole(role),
        [field]: value,
      },
    }));
  };

  // Сохранение изменений для роли
  const handleSavePermissions = (role: 'MANAGER' | 'WORKER') => {
    const local = localPermissions[role];
    if (!local) return;

    const existing = column?.rolePermissions.find((p) => p.role === role);

    if (existing) {
      // Обновляем существующее разрешение
      const hasChanges =
        existing.canView !== local.canView || existing.canEdit !== local.canEdit;

      if (hasChanges) {
        updatePermission({
          permissionId: existing.id,
          data: {
            canView: local.canView,
            canEdit: local.canEdit,
          },
        });
      }
    } else {
      // Создаем новое разрешение
      createPermission({
        columnId,
        role,
        canView: local.canView,
        canEdit: local.canEdit,
        canCreate: false,
      });
    }
  };

  const handleRemovePermission = (permissionId: string) => {
    deletePermission({ permissionId, columnId });
    // Сбрасываем локальное состояние к значениям по умолчанию
    const role = column?.rolePermissions.find((p) => p.id === permissionId)?.role;
    if (role && (role === 'MANAGER' || role === 'WORKER')) {
      setLocalPermissions((prev) => ({
        ...prev,
        [role]: { canView: true, canEdit: false },
      }));
    }
  };

  // Проверяем, есть ли несохраненные изменения для роли
  const hasUnsavedChanges = (role: 'MANAGER' | 'WORKER') => {
    const local = localPermissions[role];
    if (!local) return false;

    const existing = column?.rolePermissions.find((p) => p.role === role);
    if (!existing) {
      // Если разрешения нет, проверяем, отличается ли от значений по умолчанию
      return local.canView !== true || local.canEdit !== false;
    }

    return existing.canView !== local.canView || existing.canEdit !== local.canEdit;
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Настройка разрешений: {columnName}</DialogTitle>
          <DialogDescription>
            Настройте видимость и возможность редактирования столбца для разных ролей
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-4">
            <div className="h-20 bg-muted animate-pulse rounded" />
            <div className="h-20 bg-muted animate-pulse rounded" />
          </div>
        )}

        {column && (
          <div className="space-y-6">
            {/* ADMIN - всегда видит и редактирует */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base font-semibold">Администратор</Label>
                  <p className="text-xs text-muted-foreground">
                    Администратор всегда имеет полный доступ
                  </p>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="text-green-600">✓ Видеть</span>
                  <span className="text-green-600">✓ Редактировать</span>
                </div>
              </div>
            </div>

            {/* MANAGER */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <Label className="text-base font-semibold">Менеджер</Label>
                  <p className="text-xs text-muted-foreground">
                    {currentUser?.role === 'ADMIN'
                      ? 'Вы можете ограничить доступ менеджера к этому столбцу'
                      : 'Менеджер по умолчанию видит и может редактировать столбец'}
                  </p>
                </div>
              </div>
              {currentUser?.role === 'ADMIN' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="manager-view">Может видеть столбец</Label>
                    <input
                      type="checkbox"
                      id="manager-view"
                      checked={getPermissionForRole('MANAGER').canView}
                      onChange={(e) =>
                        handleLocalPermissionChange('MANAGER', 'canView', e.target.checked)
                      }
                      disabled={isPending}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="manager-edit">Может редактировать столбец</Label>
                    <input
                      type="checkbox"
                      id="manager-edit"
                      checked={getPermissionForRole('MANAGER').canEdit}
                      onChange={(e) =>
                        handleLocalPermissionChange('MANAGER', 'canEdit', e.target.checked)
                      }
                      disabled={isPending}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      size="sm"
                      onClick={() => handleSavePermissions('MANAGER')}
                      disabled={isPending || !hasUnsavedChanges('MANAGER')}
                    >
                      {isPending ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                    {column.rolePermissions.find((p) => p.role === 'MANAGER') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleRemovePermission(
                            column.rolePermissions.find((p) => p.role === 'MANAGER')!.id,
                          )
                        }
                        disabled={isPending}
                        className="text-destructive hover:text-destructive"
                      >
                        Сбросить
                      </Button>
                    )}
                  </div>
                </div>
              )}
              {currentUser?.role === 'MANAGER' && (
                <div className="flex gap-2 text-sm">
                  <span className="text-green-600">✓ Видеть</span>
                  <span className="text-green-600">✓ Редактировать</span>
                </div>
              )}
            </div>

            {/* WORKER */}
            <div className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <Label className="text-base font-semibold">Работник</Label>
                  <p className="text-xs text-muted-foreground">
                    Настройте доступ работника к столбцу
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="worker-view">Может видеть столбец</Label>
                  <input
                    type="checkbox"
                    id="worker-view"
                    checked={getPermissionForRole('WORKER').canView}
                    onChange={(e) =>
                      handleLocalPermissionChange('WORKER', 'canView', e.target.checked)
                    }
                    disabled={isPending}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="worker-edit">Может редактировать столбец</Label>
                  <input
                    type="checkbox"
                    id="worker-edit"
                    checked={getPermissionForRole('WORKER').canEdit}
                    onChange={(e) =>
                      handleLocalPermissionChange('WORKER', 'canEdit', e.target.checked)
                    }
                    disabled={isPending}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => handleSavePermissions('WORKER')}
                    disabled={isPending || !hasUnsavedChanges('WORKER')}
                  >
                    {isPending ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                  {column.rolePermissions.find((p) => p.role === 'WORKER') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleRemovePermission(
                          column.rolePermissions.find((p) => p.role === 'WORKER')!.id,
                        )
                      }
                      disabled={isPending}
                      className="text-destructive hover:text-destructive"
                    >
                      Сбросить
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
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
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
