/**
 * @file: index.tsx
 * @description: Страница списка workspaces (защищенная)
 * @created: 2025-01-XX
 */

import { useWorkspaces } from '@/entities/workspaces/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

export function WorkspacesPage() {
  const { data: workspaces, isLoading, error } = useWorkspaces();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Ошибка</CardTitle>
            <CardDescription>Не удалось загрузить workspaces</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive">
              {error instanceof Error ? error.message : 'Неизвестная ошибка'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Workspaces</h1>
        <p className="text-muted-foreground mt-2">
          Список доступных вам workspaces
        </p>
      </div>

      {workspaces && workspaces.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <Card key={workspace.id}>
              <CardHeader>
                <CardTitle>{workspace.name}</CardTitle>
                {workspace.description && (
                  <CardDescription>{workspace.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <p>ID: {workspace.id}</p>
                  <p>Создан: {new Date(workspace.createdAt).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              У вас пока нет доступных workspaces
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

