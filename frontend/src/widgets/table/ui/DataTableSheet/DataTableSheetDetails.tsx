/**
 * @file: DataTableSheetDetails.tsx
 * @description: Сайдбар с деталями выбранной строки
 * @dependencies: useDataTable, Sheet, Button, Tooltip
 * @created: 2025-01-04
 */

import { ChevronDown, ChevronUp, X } from 'lucide-react';
import * as React from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/ui/sheet';
import { Button } from '@/shared/ui/button';
import { Separator } from '@/shared/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/ui/tooltip';
import { Kbd } from '@/shared/ui/kbd';
import { cn } from '@/shared/lib/utils';
import { useDataTable } from '../../lib';
import { Skeleton } from '@/shared/ui/skeleton';

export interface DataTableSheetDetailsProps {
  title?: React.ReactNode;
  titleClassName?: string;
  children?: React.ReactNode;
}

export function DataTableSheetDetails({
  title,
  titleClassName,
  children,
}: DataTableSheetDetailsProps) {
  const { table, rowSelection, isLoading } = useDataTable();

  const selectedRowKey = Object.keys(rowSelection)?.[0];

  const selectedRow = React.useMemo(() => {
    if (isLoading && !selectedRowKey) return;
    return table
      .getCoreRowModel()
      .flatRows.find((row) => row.id === selectedRowKey);
  }, [selectedRowKey, isLoading, table]);

  const index = table
    .getCoreRowModel()
    .flatRows.findIndex((row) => row.id === selectedRow?.id);

  const nextId = React.useMemo(
    () => table.getCoreRowModel().flatRows[index + 1]?.id,
    [index, isLoading, table],
  );

  const prevId = React.useMemo(
    () => table.getCoreRowModel().flatRows[index - 1]?.id,
    [index, isLoading, table],
  );

  const onPrev = React.useCallback(() => {
    if (prevId) table.setRowSelection({ [prevId]: true });
  }, [prevId, table]);

  const onNext = React.useCallback(() => {
    if (nextId) table.setRowSelection({ [nextId]: true });
  }, [nextId, table]);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (!selectedRowKey) return;

      const activeElement = document.activeElement;
      const isMenuActive = activeElement?.closest('[role="menu"]');

      if (isMenuActive) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        onPrev();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        onNext();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [selectedRowKey, onNext, onPrev]);

  return (
    <Sheet
      open={!!selectedRowKey}
      onOpenChange={() => {
        const el = selectedRowKey
          ? document.getElementById(selectedRowKey)
          : null;
        table.resetRowSelection();

        setTimeout(() => el?.focus(), 0);
      }}
    >
      <SheetContent
        className="overflow-y-auto p-0 sm:max-w-md"
        showCloseButton={false}
      >
        <SheetHeader className="sticky top-0 z-10 border-b bg-background p-4">
          <div className="flex items-center justify-between gap-2">
            <SheetTitle className={cn(titleClassName, 'truncate text-left')}>
              {isLoading && !selectedRowKey ? (
                <Skeleton className="h-7 w-36" />
              ) : (
                title
              )}
            </SheetTitle>
            <div className="flex h-7 items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      disabled={!prevId}
                      onClick={onPrev}
                    >
                      <ChevronUp className="h-5 w-5" />
                      <span className="sr-only">Предыдущая</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Навигация <Kbd variant="outline">↑</Kbd>
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      disabled={!nextId}
                      onClick={onNext}
                    >
                      <ChevronDown className="h-5 w-5" />
                      <span className="sr-only">Следующая</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Навигация <Kbd variant="outline">↓</Kbd>
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Separator orientation="vertical" className="mx-1" />
              <SheetClose autoFocus={true} asChild>
                <Button size="icon" variant="ghost" className="h-7 w-7">
                  <X className="h-5 w-5" />
                  <span className="sr-only">Закрыть</span>
                </Button>
              </SheetClose>
            </div>
          </div>
        </SheetHeader>
        <SheetDescription className="sr-only">
          Детали выбранной строки
        </SheetDescription>
        <div className="p-4">{children}</div>
      </SheetContent>
    </Sheet>
  );
}

