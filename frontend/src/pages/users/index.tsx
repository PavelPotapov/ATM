/**
 * @file: index.tsx
 * @description: Страница списка пользователей (защищенная, только для ADMIN)
 * @created: 2025-01-XX
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

export function UsersPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Пользователи</h1>
        <p className="text-muted-foreground mt-2">
          Управление пользователями системы
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список пользователей</CardTitle>
          <CardDescription>
            Здесь будет отображаться список всех пользователей
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Функциональность в разработке
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

