/**
 * @file: index.tsx
 * @description: Страница списка пользователей (защищенная, только для ADMIN)
 * @created: 2025-01-XX
 */

import { useMemo } from 'react';
import { useUsers, type UserDto } from '@/entities/users';
import { DataTable, type ColumnDef } from '@/widgets/table';
import { Badge } from '@/shared/ui/badge';
import { useHasPermission, PERMISSIONS } from '@/features/permissions';
import { DeleteUserButton, CreateUserDialog } from '@/features/users';
import {
  cvaContainer,
  cvaHeaderContainer,
  cvaTitle,
  cvaDescription,
  cvaErrorDescription,
  cvaHeaderActions,
} from './styles/UsersPage.styles';
import { cvaActionsCell, cvaActionsHeader } from './styles/UsersPageActions.styles';

/**
 * Форматирование роли для отображения
 */
const formatRole = (role: string) => {
  const roleMap: Record<string, string> = {
    ADMIN: 'Администратор',
    MANAGER: 'Менеджер',
    WORKER: 'Работник',
  };
  return roleMap[role] || role;
};

/**
 * Получение варианта Badge для роли
 */
const getRoleVariant = (role: string): 'default' | 'secondary' | 'destructive' => {
  switch (role) {
    case 'ADMIN':
      return 'destructive';
    case 'MANAGER':
      return 'default';
    case 'WORKER':
      return 'secondary';
    default:
      return 'default';
  }
};

export function UsersPage() {
  const { data: users, isLoading, error } = useUsers();
  const canDelete = useHasPermission(PERMISSIONS.USERS_DELETE);
  const canCreate = useHasPermission(PERMISSIONS.USERS_CREATE);

  const columns = useMemo<ColumnDef<UserDto>[]>(
    () => {
      const baseColumns: ColumnDef<UserDto>[] = [
        {
          accessorKey: 'email',
          header: 'Email',
        },
        {
          accessorKey: 'firstName',
          header: 'Имя',
          cell: ({ row }) => row.original.firstName || '-',
        },
        {
          accessorKey: 'lastName',
          header: 'Фамилия',
          cell: ({ row }) => row.original.lastName || '-',
        },
        {
          accessorKey: 'role',
          header: 'Роль',
          cell: ({ row }) => {
            const role = row.original.role;
            return (
              <Badge variant={getRoleVariant(role)}>
                {formatRole(role)}
              </Badge>
            );
          },
        },
        {
          accessorKey: 'createdAt',
          header: 'Создан',
          cell: ({ row }) => {
            return new Date(row.original.createdAt).toLocaleDateString('ru-RU');
          },
        },
      ];

      // Добавляем колонку действий только если есть разрешение на удаление
      if (canDelete) {
        baseColumns.push({
          id: 'actions',
          header: () => <div className={cvaActionsHeader()}>Действия</div>,
          size: 50, // Уменьшенная ширина столбца
          minSize: 50,
          maxSize: 50,
          enableResizing: false, // Отключаем ресайз для колонки действий
          cell: ({ row }) => {
            return (
              <div className={cvaActionsCell()}>
                <DeleteUserButton user={row.original} />
              </div>
            );
          },
        });
      }

      return baseColumns;
    },
    [canDelete],
  );

  if (isLoading) {
    return (
      <div className={cvaContainer()}>
        <div className={cvaHeaderContainer()}>
          <h1 className={cvaTitle()}>Пользователи</h1>
          <p className={cvaDescription()}>
            Загрузка пользователей...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cvaContainer()}>
        <div className={cvaHeaderContainer()}>
          <h1 className={cvaTitle()}>Пользователи</h1>
          <p className={cvaErrorDescription()}>
            Ошибка загрузки пользователей: {error instanceof Error ? error.message : 'Неизвестная ошибка'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cvaContainer()}>
      <div className={cvaHeaderContainer()}>
        <div>
          <h1 className={cvaTitle()}>Пользователи</h1>
          <p className={cvaDescription()}>
            Управление пользователями системы
          </p>
        </div>
        {canCreate && (
          <div className={cvaHeaderActions()}>
            <CreateUserDialog />
          </div>
        )}
      </div>

      <DataTable
        columns={columns}
        data={users || []}
        caption={`Всего пользователей: ${users?.length || 0}`}
      />
    </div>
  );
}
