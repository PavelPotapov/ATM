/**
 * @file: LoginForm.tsx
 * @description: Компонент формы входа в систему
 * @created: 2025-01-XX
 */

import { useForm } from 'react-hook-form';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { useLogin, type LoginDto } from '../api';

export function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginDto>();
  const { mutate: login, isPending, error: loginError } = useLogin();

  const onSubmit = (data: LoginDto) => {
    login(data);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Вход в систему</CardTitle>
        <CardDescription>Введите email и пароль для входа</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel>Email</FieldLabel>
            <FieldGroup>
              <Input
                type="email"
                placeholder="email@example.com"
                {...register('email', {
                  required: 'Email обязателен',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Некорректный email',
                  },
                })}
              />
            </FieldGroup>
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
            )}
          </Field>

          <Field>
            <FieldLabel>Пароль</FieldLabel>
            <FieldGroup>
              <Input
                type="password"
                placeholder="Введите пароль"
                {...register('password', {
                  required: 'Пароль обязателен',
                  minLength: {
                    value: 6,
                    message: 'Пароль должен быть минимум 6 символов',
                  },
                })}
              />
            </FieldGroup>
            {errors.password && (
              <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
            )}
          </Field>

          {loginError && (
            <div className="text-sm text-destructive">
              {loginError instanceof Error ? loginError.message : 'Ошибка входа'}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isPending || isSubmitting}>
            {isPending || isSubmitting ? 'Вход...' : 'Войти'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

