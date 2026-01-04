/**
 * @file: EstimateCard.tsx
 * @description: Компонент карточки сметы
 * @created: 2025-01-04
 */

import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import type { EstimateDto } from '../../api/dto/estimate.dto';
import { ROUTES } from '@/shared/config/routes.config';

interface EstimateCardProps {
  estimate: EstimateDto;
}

/**
 * Компонент карточки сметы
 * Отображает основную информацию о смете и ссылку на детальную страницу
 */
export function EstimateCard({ estimate }: EstimateCardProps) {
  return (
    <Link
      to={ROUTES.ESTIMATE_DETAIL(estimate.id)}
      className="block"
    >
      <Card className="cursor-pointer transition-colors hover:bg-accent">
        <CardHeader>
          <CardTitle>{estimate.name}</CardTitle>
          {estimate.description && (
            <CardDescription>{estimate.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p>Создан: {new Date(estimate.createdAt).toLocaleDateString('ru-RU')}</p>
            <p>Обновлен: {new Date(estimate.updatedAt).toLocaleDateString('ru-RU')}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

