/**
 * @file: $workspaceId.tsx
 * @description: Страница просмотра workspace по ID (защищенная)
 * @created: 2025-01-XX
 */

import { useParams } from '@tanstack/react-router';
import { useWorkspace } from '@/entities/workspaces/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

export function WorkspacePage() {
  const { workspaceId } = useParams({ strict: false });
  const { data: workspace, isLoading, error } = useWorkspace(workspaceId);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Ошибка</CardTitle>
            <CardDescription>Не удалось загрузить workspace</CardDescription>
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

  if (!workspace) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Workspace не найден
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{workspace.name}</h1>
        {workspace.description && (
          <p className="text-muted-foreground mt-2">{workspace.description}</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Информация</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">ID:</span>{' '}
                <span className="text-muted-foreground">{workspace.id}</span>
              </div>
              <div>
                <span className="font-medium">Создан:</span>{' '}
                <span className="text-muted-foreground">
                  {new Date(workspace.createdAt).toLocaleString('ru-RU')}
                </span>
              </div>
              <div>
                <span className="font-medium">Обновлен:</span>{' '}
                <span className="text-muted-foreground">
                  {new Date(workspace.updatedAt).toLocaleString('ru-RU')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

