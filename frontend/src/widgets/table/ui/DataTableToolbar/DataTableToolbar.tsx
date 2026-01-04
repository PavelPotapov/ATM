/**
 * @file: DataTableToolbar.tsx
 * @description: Тулбар таблицы с поиском, счетчиками строк и опциями
 * @dependencies: useDataTable, useControls, formatCompactNumber
 * @created: 2025-01-04
 */

import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useMemo } from 'react';
import { Button } from '@/shared/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/tooltip';
import { Kbd } from '@/shared/ui/kbd';
import { useHotKey } from '@/shared/hooks';
import { formatCompactNumber } from '@/shared/lib/utils';
import { useDataTable, useControls } from '../../lib';
import { DataTableResetButton } from '../DataTableResetButton';
import { DataTableViewOptions } from '../DataTableViewOptions';

interface DataTableToolbarProps {
  renderActions?: () => React.ReactNode;
}

export function DataTableToolbar({ renderActions }: DataTableToolbarProps) {
  const { table, isLoading, columnFilters } = useDataTable();
  const { open, setOpen } = useControls();
  useHotKey(() => setOpen((prev) => !prev), 'b');
  const filters = table.getState().columnFilters;

  const rows = useMemo(
    () => ({
      total: table.getCoreRowModel().rows.length,
      filtered: table.getFilteredRowModel().rows.length,
    }),
    [isLoading, columnFilters],
  );

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setOpen((prev) => !prev)}
                className="hidden gap-2 sm:flex"
              >
                {open ? (
                  <>
                    <PanelLeftClose className="h-4 w-4" />
                    <span className="hidden md:block">Скрыть фильтры</span>
                  </>
                ) : (
                  <>
                    <PanelLeftOpen className="h-4 w-4" />
                    <span className="hidden md:block">Показать фильтры</span>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>
                Переключить фильтры с помощью{' '}
                <Kbd className="ml-1 text-muted-foreground group-hover:text-accent-foreground">
                  <span className="mr-1">⌘</span>
                  <span>B</span>
                </Kbd>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div>
          <p className="hidden text-sm text-muted-foreground sm:block">
            <span className="font-mono font-medium">
              {formatCompactNumber(rows.filtered)}
            </span>{' '}
            из{' '}
            <span className="font-mono font-medium">
              {formatCompactNumber(rows.total)}
            </span>{' '}
            строк <span className="sr-only sm:not-sr-only">отфильтровано</span>
          </p>
          <p className="block text-sm text-muted-foreground sm:hidden">
            <span className="font-mono font-medium">
              {formatCompactNumber(rows.filtered)}
            </span>{' '}
            строк
          </p>
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        {filters.length ? <DataTableResetButton /> : null}
        {renderActions?.()}
        <DataTableViewOptions />
      </div>
    </div>
  );
}

