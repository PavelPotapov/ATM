/**
 * @file: $workspaceId.tsx
 * @description: Страница просмотра workspace по ID (защищенная)
 * @created: 2025-01-XX
 */

import { useParams } from '@tanstack/react-router';
import { useWorkspace } from '@/entities/workspaces/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import {
  cvaContainer,
  cvaHeaderContainer,
  cvaTitle,
  cvaDescription,
  cvaGrid,
  cvaInfoContainer,
  cvaInfoLabel,
  cvaInfoValue,
  cvaErrorCard,
  cvaNotFoundText,
  cvaSkeletonContainer,
} from './styles/WorkspacePage.styles';

export function WorkspacePage() {
  const { workspaceId } = useParams({ strict: false });
  const { data: workspace, isLoading, error } = useWorkspace(workspaceId);

  if (isLoading) {
    return (
      <div className={cvaContainer()}>
        <div className={cvaSkeletonContainer()}>
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
      <div className={cvaContainer()}>
        <Card className={cvaErrorCard()}>
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
      <div className={cvaContainer()}>
        <Card>
          <CardContent className="pt-6">
            <p className={cvaNotFoundText()}>
              Workspace не найден
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cvaContainer()}>
      <div className={cvaHeaderContainer()}>
        <h1 className={cvaTitle()}>{workspace.name}</h1>
        {workspace.description && (
          <p className={cvaDescription()}>{workspace.description}</p>
        )}
      </div>

      <div className={cvaGrid()}>
        <Card>
          <CardHeader>
            <CardTitle>Информация</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cvaInfoContainer()}>
              <div>
                <span className={cvaInfoLabel()}>ID:</span>{' '}
                <span className={cvaInfoValue()}>{workspace.id}</span>
              </div>
              <div>
                <span className={cvaInfoLabel()}>Создан:</span>{' '}
                <span className={cvaInfoValue()}>
                  {new Date(workspace.createdAt).toLocaleString('ru-RU')}
                </span>
              </div>
              <div>
                <span className={cvaInfoLabel()}>Обновлен:</span>{' '}
                <span className={cvaInfoValue()}>
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

