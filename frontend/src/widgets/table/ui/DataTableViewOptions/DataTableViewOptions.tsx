/**
 * @file: DataTableViewOptions.tsx
 * @description: Компонент для управления видимостью и порядком колонок
 * @dependencies: useDataTable, Command, Popover
 * @created: 2025-01-04
 */

import { Check, Settings2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/shared/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/popover';
import { cn } from '@/shared/lib/utils';
import { useDataTable } from '../../lib';

export function DataTableViewOptions() {
  const { table } = useDataTable();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const columnOrder = table.getState().columnOrder;

  const sortedColumns = useMemo(
    () =>
      table.getAllColumns().sort((a, b) => {
        return columnOrder.indexOf(a.id) - columnOrder.indexOf(b.id);
      }),
    [columnOrder, table],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          role="combobox"
          aria-expanded={open}
          className="h-9 w-9"
        >
          <Settings2 className="h-4 w-4" />
          <span className="sr-only">Настройки колонок</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent side="bottom" align="end" className="w-[200px] p-0">
        <Command
          filter={(value, search) => {
            // value - это column.id из CommandItem
            // search - это текст из поиска
            const column = sortedColumns.find((col) => col.id === value);
            if (!column) return 0;
            
            const label =
              column.columnDef.meta?.label ||
              (typeof column.columnDef.header === 'string'
                ? column.columnDef.header
                : column.id);
            
            // Если поиск пустой - показываем все
            if (!search || search.trim() === '') return 1;
            
            // Ищем по названию колонки (не по id)
            return label.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
          }}
        >
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder="Поиск колонок..."
          />
          <CommandList>
            <CommandEmpty>Колонки не найдены.</CommandEmpty>
            <CommandGroup>
              {sortedColumns
                .filter(
                  (column) =>
                    column.id !== '_actions' && // Исключаем служебные колонки
                    (column.getCanHide() !== false), // Показываем все колонки, которые могут быть скрыты
                )
                .map((column) => {
                  const label =
                    column.columnDef.meta?.label ||
                    (typeof column.columnDef.header === 'string'
                      ? column.columnDef.header
                      : column.id);
                  
                  return (
                    <CommandItem
                      key={column.id}
                      value={column.id}
                      onSelect={() =>
                        column.toggleVisibility(!column.getIsVisible())
                      }
                      className="capitalize"
                    >
                      <div
                        className={cn(
                          'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                          column.getIsVisible()
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible',
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </div>
                      <span>{label}</span>
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

