/**
 * @file: DataTableResetButton.tsx
 * @description: Кнопка сброса фильтров таблицы
 * @dependencies: useDataTable, useHotKey
 * @created: 2025-01-04
 */

import { X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/tooltip';
import { Kbd } from '@/shared/ui/kbd';
import { useHotKey } from '@/shared/hooks';
import { useDataTable } from '../../lib';

export function DataTableResetButton() {
  const { table } = useDataTable();
  useHotKey(() => table.resetColumnFilters(), 'Escape');

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
          >
            <X className="mr-2 h-4 w-4" />
            Сбросить
          </Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>
            Сбросить фильтры с помощью{' '}
            <Kbd className="ml-1 text-muted-foreground group-hover:text-accent-foreground">
              <span className="mr-1">⌘</span>
              <span>Esc</span>
            </Kbd>
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

