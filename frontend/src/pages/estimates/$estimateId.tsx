/**
 * @file: $estimateId.tsx
 * @description: Страница просмотра сметы по ID (защищенная)
 * @created: 2025-01-04
 */

import { useParams } from '@tanstack/react-router';
import { useEstimate } from '@/entities/estimates';
import {
  DeleteEstimateButton,
  CreateEstimateColumnDialog,
  ColumnDetailsDialog,
  EditEstimateColumnDialog,
  ColumnPermissionsDialog,
  DeleteEstimateColumnButton,
} from '@/features/estimates';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { Badge } from '@/shared/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

export function EstimatePage() {
  const { estimateId } = useParams({ strict: false });
  const { data: estimate, isLoading, error } = useEstimate(estimateId, true);

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
            <CardDescription>Не удалось загрузить смету</CardDescription>
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

  if (!estimate) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Смета не найдена
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Проверяем, что это полная информация (со столбцами)
  const estimateFull = 'columns' in estimate ? estimate : null;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{estimate.name}</h1>
          {estimate.description && (
            <p className="text-muted-foreground mt-2">{estimate.description}</p>
          )}
        </div>
        {estimateFull && <DeleteEstimateButton estimate={estimate} />}
      </div>

      {estimateFull ? (
        <Tabs defaultValue="info" className="w-full">
          <TabsList>
            <TabsTrigger value="info">Информация</TabsTrigger>
            <TabsTrigger value="table">Таблица</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Информация</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Создатель:</span>{' '}
                      <span className="text-muted-foreground">
                        {estimate.createdBy.firstName && estimate.createdBy.lastName
                          ? `${estimate.createdBy.firstName} ${estimate.createdBy.lastName}`
                          : estimate.createdBy.email}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Создана:</span>{' '}
                      <span className="text-muted-foreground">
                        {new Date(estimate.createdAt).toLocaleString('ru-RU')}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Обновлена:</span>{' '}
                      <span className="text-muted-foreground">
                        {new Date(estimate.updatedAt).toLocaleString('ru-RU')}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Строк в смете:</span>{' '}
                      <span className="text-muted-foreground">
                        {estimateFull.rowsCount}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Столбцы сметы</h2>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Всего столбцов: {estimateFull.columns.length}
                  </span>
                  <CreateEstimateColumnDialog
                    estimateId={estimateId}
                    existingColumnsCount={estimateFull.columns.length}
                  />
                </div>
              </div>

              {estimateFull.columns.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {estimateFull.columns.map((column) => (
                    <Card key={column.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">{column.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">{column.dataType}</Badge>
                            <div className="flex items-center gap-1">
                              <ColumnDetailsDialog columnId={column.id} columnName={column.name} />
                              <EditEstimateColumnDialog columnId={column.id} />
                              <ColumnPermissionsDialog columnId={column.id} columnName={column.name} />
                              <DeleteEstimateColumnButton
                                columnId={column.id}
                                columnName={column.name}
                                estimateId={estimateId}
                              />
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Порядок:</span>{' '}
                            <span className="text-muted-foreground">{column.order}</span>
                          </div>
                          <div>
                            <span className="font-medium">Обязательное:</span>{' '}
                            <span className="text-muted-foreground">
                              {column.required ? 'Да' : 'Нет'}
                            </span>
                          </div>
                          {column.dataType === 'ENUM' && column.allowedValues && (
                            <div>
                              <span className="font-medium">Разрешенные значения:</span>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {JSON.parse(column.allowedValues).map((value: string, idx: number) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {value}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      У сметы пока нет столбцов. Создайте первый столбец для начала работы.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="table" className="mt-6">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Таблица данных будет здесь. Функционал в разработке.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Информация</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Создатель:</span>{' '}
                  <span className="text-muted-foreground">
                    {estimate.createdBy.firstName && estimate.createdBy.lastName
                      ? `${estimate.createdBy.firstName} ${estimate.createdBy.lastName}`
                      : estimate.createdBy.email}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Создана:</span>{' '}
                  <span className="text-muted-foreground">
                    {new Date(estimate.createdAt).toLocaleString('ru-RU')}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Обновлена:</span>{' '}
                  <span className="text-muted-foreground">
                    {new Date(estimate.updatedAt).toLocaleString('ru-RU')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

