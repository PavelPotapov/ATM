/**
 * @file: DeleteUserButton.tsx
 * @description: Кнопка удаления пользователя с модалкой подтверждения
 * @created: 2025-01-XX
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
import { useDeleteUser } from '@/entities/users';
import type { UserDto } from '@/entities/users';
import { cvaDeleteButton, cvaDeleteIcon } from './styles/DeleteUserButton.styles';

interface DeleteUserButtonProps {
  user: UserDto;
}

export function DeleteUserButton({ user }: DeleteUserButtonProps) {
  const [open, setOpen] = useState(false);
  const { mutate: deleteUser, isPending } = useDeleteUser();

  const handleDelete = () => {
    deleteUser(user.id, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  const displayName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.email;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cvaDeleteButton()}
        >
          <Trash2 className={cvaDeleteIcon()} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить пользователя?</AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены, что хотите удалить пользователя{' '}
            <strong>{displayName}</strong> ({user.email})?
            <br />
            Это действие нельзя отменить.
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

