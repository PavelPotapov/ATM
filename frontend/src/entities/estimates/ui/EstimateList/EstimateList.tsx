/**
 * @file: EstimateList.tsx
 * @description: Компонент списка смет
 * @created: 2025-01-04
 */

import { useEstimatesByWorkspace } from '../../api';
import { EstimateCard } from '../EstimateCard';
import { Card, CardContent } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';

interface EstimateListProps {
  workspaceId: string;
}

/**
 * Компонент списка смет проекта
 * Отображает список смет с обработкой loading/error состояний
 */
export function EstimateList({ workspaceId }: EstimateListProps) {
  const { data: estimates, isLoading, error } = useEstimatesByWorkspace(workspaceId);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-destructive text-center">
            {error instanceof Error ? error.message : 'Не удалось загрузить сметы'}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!estimates || estimates.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            У проекта пока нет смет
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {estimates.map((estimate) => (
        <EstimateCard key={estimate.id} estimate={estimate} />
      ))}
    </div>
  );
}

