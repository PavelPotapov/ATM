/**
 * @file: date-picker-with-range.tsx
 * @description: Компонент выбора диапазона дат
 * @dependencies: react-day-picker, Calendar, Popover, date-fns
 * @created: 2025-01-04
 */

'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Separator } from '@/shared/ui/separator';
import { kbdVariants } from '@/shared/ui/kbd';
import { useDebounce } from '@/shared/hooks';
import { cn } from '@/shared/lib/utils';
import type { DatePreset } from '@/widgets/table/types';
import { presets as defaultPresets } from '@/shared/constants/date-preset';

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  presets?: DatePreset[];
}

export function DatePickerWithRange({
  className,
  date,
  setDate,
  presets = defaultPresets,
}: DatePickerWithRangeProps) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (!open) return;

      presets.forEach((preset) => {
        if (preset.shortcut === e.key) {
          setDate({ from: preset.from, to: preset.to });
        }
      });
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [setDate, presets, open]);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            size="sm"
            className={cn(
              'max-w-full justify-start truncate text-left font-normal hover:bg-muted/50',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <span className="truncate">
                  {format(date.from, 'LLL dd, y', { locale: ru })} -{' '}
                  {format(date.to, 'LLL dd, y', { locale: ru })}
                </span>
              ) : (
                format(date.from, 'LLL dd, y', { locale: ru })
              )
            ) : (
              <span>Выберите дату</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col justify-between sm:flex-row">
            <div className="hidden sm:block">
              <DatePresets onSelect={setDate} selected={date} presets={presets} />
            </div>
            <div className="block p-3 sm:hidden">
              <DatePresetsSelect
                onSelect={setDate}
                selected={date}
                presets={presets}
              />
            </div>
            <Separator orientation="vertical" className="h-auto w-px" />
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
            />
          </div>
          <Separator />
          <CustomDateRange onSelect={setDate} selected={date} />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function DatePresets({
  selected,
  onSelect,
  presets,
}: {
  selected: DateRange | undefined;
  onSelect: (date: DateRange | undefined) => void;
  presets: DatePreset[];
}) {
  return (
    <div className="flex flex-col gap-2 p-3">
      <p className="mx-3 text-xs uppercase text-muted-foreground">Диапазон дат</p>
      <div className="grid gap-1">
        {presets.map(({ label, shortcut, from, to }) => {
          const isActive = selected?.from?.getTime() === from.getTime() && selected?.to?.getTime() === to.getTime();
          return (
            <Button
              key={label}
              variant={isActive ? 'outline' : 'ghost'}
              size="sm"
              onClick={() => onSelect({ from, to })}
              className={cn(
                'flex items-center justify-between gap-6',
                !isActive && 'border border-transparent',
              )}
            >
              <span className="mr-auto">{label}</span>
              <span className={cn(kbdVariants(), 'uppercase')}>{shortcut}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

function DatePresetsSelect({
  selected,
  onSelect,
  presets,
}: {
  selected: DateRange | undefined;
  onSelect: (date: DateRange | undefined) => void;
  presets: DatePreset[];
}) {
  function findPreset(from?: Date, to?: Date) {
    return presets.find(
      (p) => p.from.getTime() === from?.getTime() && p.to.getTime() === to?.getTime(),
    )?.shortcut;
  }

  const [value, setValue] = React.useState<string | undefined>(
    findPreset(selected?.from, selected?.to),
  );

  React.useEffect(() => {
    const preset = findPreset(selected?.from, selected?.to);
    if (preset === value) return;
    setValue(preset);
  }, [selected, presets, value]);

  return (
    <Select
      value={value}
      onValueChange={(v) => {
        const preset = presets.find((p) => p.shortcut === v);
        if (preset) {
          onSelect({ from: preset.from, to: preset.to });
        }
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Предустановки дат" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Предустановки дат</SelectLabel>
          {presets.map(({ label, shortcut }) => {
            return (
              <SelectItem
                key={label}
                value={shortcut}
                className="flex items-center justify-between [&>span:last-child]:flex [&>span:last-child]:w-full [&>span:last-child]:justify-between"
              >
                <span>{label}</span>
                <span
                  className={cn(
                    kbdVariants(),
                    'ml-2 h-5 uppercase leading-snug',
                  )}
                >
                  {shortcut}
                </span>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function CustomDateRange({
  selected,
  onSelect,
}: {
  selected: DateRange | undefined;
  onSelect: (date: DateRange | undefined) => void;
}) {
  const [dateFrom, setDateFrom] = React.useState<Date | undefined>(selected?.from);
  const [dateTo, setDateTo] = React.useState<Date | undefined>(selected?.to);
  const debounceDateFrom = useDebounce(dateFrom, 1000);
  const debounceDateTo = useDebounce(dateTo, 1000);

  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return '';
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return utcDate.toISOString().slice(0, 16);
  };

  React.useEffect(() => {
    onSelect({ from: debounceDateFrom, to: debounceDateTo });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceDateFrom, debounceDateTo]);

  return (
    <div className="flex flex-col gap-2 p-3">
      <p className="text-xs uppercase text-muted-foreground">Произвольный диапазон</p>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid w-full gap-1.5">
          <Label htmlFor="from">Начало</Label>
          <Input
            key={formatDateForInput(selected?.from)}
            type="datetime-local"
            id="from"
            name="from"
            defaultValue={formatDateForInput(selected?.from)}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              if (!Number.isNaN(newDate.getTime())) {
                setDateFrom(newDate);
              }
            }}
            disabled={!selected?.from}
          />
        </div>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="to">Конец</Label>
          <Input
            key={formatDateForInput(selected?.to)}
            type="datetime-local"
            id="to"
            name="to"
            defaultValue={formatDateForInput(selected?.to)}
            onChange={(e) => {
              const newDate = new Date(e.target.value);
              if (!Number.isNaN(newDate.getTime())) {
                setDateTo(newDate);
              }
            }}
            disabled={!selected?.to}
          />
        </div>
      </div>
    </div>
  );
}




