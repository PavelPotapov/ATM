/**
 * @file: index.tsx
 * @description: Страница входа в систему
 * @created: 2025-01-XX
 */

import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';

export function LoginPage() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Реализовать логику входа
    console.log('Login form submitted');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Вход в систему</CardTitle>
          <CardDescription>Введите email и пароль для входа</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldGroup>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  required
                />
              </FieldGroup>
            </Field>

            <Field>
              <FieldLabel>Пароль</FieldLabel>
              <FieldGroup>
                <Input
                  type="password"
                  placeholder="Введите пароль"
                  required
                />
              </FieldGroup>
            </Field>

            <Button type="submit" className="w-full">
              Войти
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

