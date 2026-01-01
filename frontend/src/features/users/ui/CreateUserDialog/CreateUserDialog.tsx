/**
 * @file: CreateUserDialog.tsx
 * @description: Модалка создания пользователя с формой
 * @created: 2025-01-XX
 */

import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, RefreshCw, Eye, EyeOff, Copy, Check } from 'lucide-react';
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
import { useCreateUser, type CreateUserDto } from '@/entities/users';
import { useWorkspaces } from '@/entities/workspaces/api';
import { generatePassword, copyToClipboard } from '@/shared/lib/utils';
import { MultipleSelector, type Option } from '@/shared/ui/multipleSelector';
import {
  cvaDialogTrigger,
  cvaFormContainer,
  cvaFormField,
  cvaFormLabel,
  cvaFormInput,
  cvaFormSelect,
  cvaFormError,
} from './styles/CreateUserDialog.styles';

interface CreateUserDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const { mutate: createUser, isPending } = useCreateUser();
  const { data: workspaces } = useWorkspaces();
  
  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange : setInternalOpen;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateUserDto & { workspaceIds: string[]; password: string }>({
    defaultValues: {
      login: '',
      password: generatePassword(12), // Автоматически генерируем пароль
      firstName: '',
      lastName: '',
      role: 'WORKER',
      workspaceIds: [],
    },
  });

  const role = watch('role');
  const password = watch('password');
  const selectedWorkspaceIds = watch('workspaceIds') || [];

  // Преобразуем workspaces в формат для MultipleSelector
  const workspaceOptions = useMemo<Option[]>(() => {
    if (!workspaces) return [];
    return workspaces.map((workspace) => ({
      label: workspace.name,
      value: workspace.id,
    }));
  }, [workspaces]);

  // Преобразуем выбранные workspaceIds в формат для MultipleSelector
  const selectedWorkspaces = useMemo<Option[]>(() => {
    if (!workspaces || selectedWorkspaceIds.length === 0) return [];
    return workspaces
      .filter((w) => selectedWorkspaceIds.includes(w.id))
      .map((workspace) => ({
        label: workspace.name,
        value: workspace.id,
      }));
  }, [workspaces, selectedWorkspaceIds]);

  // Генерируем новый пароль при открытии модалки
  useEffect(() => {
    if (dialogOpen) {
      const newPassword = generatePassword(12);
      reset({
        login: '',
        password: newPassword,
        firstName: '',
        lastName: '',
        role: 'WORKER',
        workspaceIds: [],
      });
    }
  }, [dialogOpen, reset]);

  const handleGeneratePassword = () => {
    const newPassword = generatePassword(12);
    setValue('password', newPassword, { shouldDirty: true });
  };

  const handleCopyPassword = async () => {
    if (password) {
      const success = await copyToClipboard(password);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const handleWorkspaceChange = (options: Option[]) => {
    const workspaceIds = options.map((opt) => opt.value);
    setValue('workspaceIds', workspaceIds);
  };

  const onSubmit = (data: CreateUserDto & { workspaceIds: string[]; password: string }) => {
    createUser(
      {
        login: data.login,
        password: data.password,
        firstName: data.firstName || undefined,
        lastName: data.lastName || undefined,
        role: data.role || undefined,
        workspaceIds: data.workspaceIds.length > 0 ? data.workspaceIds : undefined,
      },
      {
        onSuccess: () => {
          const newPassword = generatePassword(12);
          reset({
            login: '',
            password: newPassword,
            firstName: '',
            lastName: '',
            role: 'WORKER',
            workspaceIds: [],
          });
          setDialogOpen?.(false);
        },
      },
    );
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className={cvaDialogTrigger()}>
          <Plus className="h-4 w-4" />
          Создать пользователя
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Создать пользователя</DialogTitle>
          <DialogDescription>
            Заполните форму для создания нового пользователя в системе
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className={cvaFormContainer()} autoComplete="off">
          <div className={cvaFormField()}>
            <Label htmlFor="login" className={cvaFormLabel()}>
              Логин <span className="text-destructive">*</span>
            </Label>
            <Input
              id="login"
              type="text"
              autoComplete="off"
              className={cvaFormInput()}
              {...register('login', {
                required: 'Логин обязателен для заполнения',
                minLength: {
                  value: 3,
                  message: 'Логин должен быть минимум 3 символа',
                },
              })}
            />
            {errors.login && (
              <p className={cvaFormError()}>{errors.login.message}</p>
            )}
          </div>

          <div className={cvaFormField()}>
            <Label htmlFor="password" className={cvaFormLabel()}>
              Пароль <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={cvaFormInput()}
                  placeholder="Введите пароль или сгенерируйте"
                  {...register('password', {
                    required: 'Пароль обязателен для заполнения',
                    minLength: {
                      value: 6,
                      message: 'Пароль должен быть минимум 6 символов',
                    },
                  })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleGeneratePassword}
                title="Сгенерировать пароль"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              {password && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopyPassword}
                  title="Скопировать пароль"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
            {errors.password && (
              <p className={cvaFormError()}>{errors.password.message}</p>
            )}
          </div>

          <div className={cvaFormField()}>
            <Label htmlFor="firstName" className={cvaFormLabel()}>
              Имя
            </Label>
            <Input
              id="firstName"
              type="text"
              autoComplete="off"
              className={cvaFormInput()}
              {...register('firstName')}
            />
          </div>

          <div className={cvaFormField()}>
            <Label htmlFor="lastName" className={cvaFormLabel()}>
              Фамилия
            </Label>
            <Input
              id="lastName"
              type="text"
              autoComplete="off"
              className={cvaFormInput()}
              {...register('lastName')}
            />
          </div>

          <div className={cvaFormField()}>
            <Label htmlFor="workspaces" className={cvaFormLabel()}>
              Проекты
            </Label>
            <MultipleSelector
              value={selectedWorkspaces}
              onValueChange={handleWorkspaceChange}
              defaultOptions={workspaceOptions}
              placeholder="Выберите проекты..."
              emptyIndicator={
                <p className="text-center text-sm text-muted-foreground">
                  Проекты не найдены
                </p>
              }
            />
          </div>

          <div className={cvaFormField()}>
            <Label htmlFor="role" className={cvaFormLabel()}>
              Роль
            </Label>
            <Select
              value={role}
              onValueChange={(value) => setValue('role', value as CreateUserDto['role'])}
            >
              <SelectTrigger id="role" className={cvaFormSelect()}>
                <SelectValue placeholder="Выберите роль" />
              </SelectTrigger>
              <SelectContent side="bottom" align="start" position="popper">
                <SelectItem value="WORKER">Работник</SelectItem>
                <SelectItem value="MANAGER">Менеджер</SelectItem>
                <SelectItem value="ADMIN">Администратор</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const newPassword = generatePassword(12);
                reset({
                  login: '',
                  password: newPassword,
                  firstName: '',
                  lastName: '',
                  role: 'WORKER',
                  workspaceIds: [],
                });
                setDialogOpen?.(false);
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

