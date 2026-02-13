/**
 * @file: DataTableFilterCommand.tsx
 * @description: Глобальный поиск с автодополнением (Cmd+K)
 * @dependencies: useDataTable, Command, useHotKey, useLocalStorage
 * @created: 2025-01-04
 */

import { Kbd } from '@/shared/ui/kbd';
import { useDataTable } from '../../lib';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/shared/ui/command';
import { useHotKey, useLocalStorage } from '@/shared/hooks';
import { formatCompactNumber } from '@/shared/lib/utils';
import { cn } from '@/shared/lib/utils';
import { LoaderCircle, Search, X } from 'lucide-react';
import type { ParserBuilder } from 'nuqs';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  columnFiltersParser,
  getFieldOptions,
  getFilterValue,
  getWordByCaretPosition,
  replaceInputByFieldType,
} from '../../lib/filter-utils';

interface DataTableFilterCommandProps {
  searchParamsParser: Record<string, ParserBuilder<any>>;
}

export function DataTableFilterCommand({
  searchParamsParser,
}: DataTableFilterCommandProps) {
  const {
    table,
    isLoading,
    filterFields: _filterFields,
    getFacetedUniqueValues,
  } = useDataTable();
  const columnFilters = table.getState().columnFilters;
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [currentWord, setCurrentWord] = useState<string>('');
  const filterFields = useMemo(
    () => _filterFields?.filter((i) => !i.commandDisabled),
    [_filterFields],
  );
  const columnParser = useMemo(
    () => columnFiltersParser({ searchParamsParser, filterFields: filterFields || [] }),
    [searchParamsParser, filterFields],
  );
  const [inputValue, setInputValue] = useState<string>(
    columnParser.serialize(columnFilters),
  );
  const [lastSearches, setLastSearches] = useLocalStorage<
    {
      search: string;
      timestamp: number;
    }[]
  >('data-table-command', []);

  useEffect(() => {
    if (currentWord !== '' && open) return;
    if (currentWord !== '' && !open) setCurrentWord('');
    if (inputValue.trim() === '' && !open) return;

    const searchParams = columnParser.parse(inputValue);

    const currentFilters = table.getState().columnFilters;
    const currentEnabledFilters = currentFilters.filter((filter) => {
      const field = _filterFields?.find((field) => field.value === filter.id);
      return !field?.commandDisabled;
    });
    const currentDisabledFilters = currentFilters.filter((filter) => {
      const field = _filterFields?.find((field) => field.value === filter.id);
      return field?.commandDisabled;
    });

    const commandDisabledFilterKeys = currentDisabledFilters.reduce(
      (prev, curr) => {
        prev[curr.id] = curr.value;
        return prev;
      },
      {} as Record<string, unknown>,
    );

    for (const key of Object.keys(searchParams)) {
      const value = searchParams[key as keyof typeof searchParams];
      table.getColumn(key)?.setFilterValue(value);
    }
    const currentFiltersToReset = currentEnabledFilters.filter((filter) => {
      return !(filter.id in searchParams);
    });
    for (const filter of currentFiltersToReset) {
      table.getColumn(filter.id)?.setFilterValue(undefined);
    }
  }, [inputValue, open, currentWord, table, columnParser, _filterFields]);

  useEffect(() => {
    if (!open) {
      setInputValue(columnParser.serialize(columnFilters));
    }
  }, [columnFilters, filterFields, open, columnParser]);

  useHotKey(() => setOpen((open) => !open), 'k');

  useEffect(() => {
    if (open) {
      inputRef?.current?.focus();
    }
  }, [open]);

  return (
    <div>
      <button
        type="button"
        className={cn(
          'group flex w-full items-center rounded-lg border border-input bg-background px-3 text-muted-foreground ring-offset-background focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:bg-accent/50 hover:text-accent-foreground',
          open ? 'hidden' : 'visible',
        )}
        onClick={() => setOpen(true)}
      >
        {isLoading ? (
          <LoaderCircle className="mr-2 h-4 w-4 shrink-0 animate-spin text-muted-foreground opacity-50 group-hover:text-popover-foreground" />
        ) : (
          <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground opacity-50 group-hover:text-popover-foreground" />
        )}
        <span className="h-11 w-full max-w-sm truncate py-3 text-left text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50 md:max-w-xl lg:max-w-4xl xl:max-w-5xl">
          {inputValue.trim() ? (
            <span className="text-foreground">{inputValue}</span>
          ) : (
            <span>Поиск в таблице...</span>
          )}
        </span>
        <Kbd className="ml-auto text-muted-foreground group-hover:text-accent-foreground">
          <span className="mr-1">⌘</span>
          <span>K</span>
        </Kbd>
      </button>
      <Command
        className={cn(
          'overflow-visible rounded-lg border border-border shadow-md dark:bg-muted/50 [&>div]:border-none',
          open ? 'visible' : 'hidden',
        )}
        filter={(value, search) =>
          getFilterValue({ value, search, currentWord })
        }
      >
        <CommandInput
          ref={inputRef}
          value={inputValue}
          onValueChange={setInputValue}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              inputRef?.current?.blur();
              setOpen(false);
            }
          }}
          onBlur={() => {
            setOpen(false);
            const search = inputValue.trim();
            if (!search) return;
            const timestamp = Date.now();
            const searchIndex = lastSearches.findIndex(
              (item) => item.search === search,
            );
            if (searchIndex !== -1) {
              lastSearches[searchIndex].timestamp = timestamp;
              setLastSearches([...lastSearches]);
              return;
            }
            setLastSearches([...lastSearches, { search, timestamp }]);
          }}
          onInput={(e) => {
            const caretPosition = e.currentTarget?.selectionStart || -1;
            const value = e.currentTarget?.value || '';
            const word = getWordByCaretPosition({ value, caretPosition });
            setCurrentWord(word);
          }}
          placeholder="Поиск в таблице..."
          className="text-foreground"
        />
        <div className="relative">
          <div className="absolute top-2 z-10 w-full overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandList className="max-h-[310px]">
              <CommandGroup heading="Фильтры">
                {filterFields?.map((field) => {
                  if (typeof field.value !== 'string') return null;
                  if (inputValue.includes(`${field.value}:`)) return null;
                  return (
                    <CommandItem
                      key={field.value}
                      value={field.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={(value) => {
                        setInputValue((prev) => {
                          if (currentWord.trim() === '') {
                            const input = `${prev}${value}`;
                            return `${input}:`;
                          }
                          const isStarting = currentWord === prev;
                          const prefix = isStarting ? '' : ' ';
                          const input = prev.replace(
                            `${prefix}${currentWord}`,
                            `${prefix}${value}`,
                          );
                          return `${input}:`;
                        });
                        setCurrentWord(`${field.value}:`);
                      }}
                      className="group"
                    >
                      {field.value}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Значения">
                {filterFields?.map((field) => {
                  if (typeof field.value !== 'string') return null;
                  if (!currentWord.includes(`${field.value}:`)) return null;

                  const column = table.getColumn(field.value);
                  const facetedValue =
                    getFacetedUniqueValues?.(table, field.value) ||
                    column?.getFacetedUniqueValues();

                  const options = getFieldOptions({ field });
                  const [filter, query] = currentWord.toLowerCase().split(':');

                  const filteredOptions = options
                    .filter((option) => {
                      if (!query) return true;
                      return String(option)
                        .toLowerCase()
                        .includes(query.toLowerCase());
                    })
                    .slice(0, 10);

                  return filteredOptions.map((option) => (
                    <CommandItem
                      key={String(option)}
                      value={`${field.value}:${option}`}
                      onSelect={() => {
                        setInputValue((prev) =>
                          replaceInputByFieldType({
                            prev,
                            currentWord,
                            optionValue: option,
                            value: String(option),
                            field,
                          }),
                        );
                      }}
                    >
                      {String(option)}
                      {facetedValue?.has(option) && (
                        <span className="ml-auto font-mono text-xs text-muted-foreground">
                          {formatCompactNumber(facetedValue.get(option) || 0)}
                        </span>
                      )}
                    </CommandItem>
                  ));
                })}
              </CommandGroup>
              {lastSearches.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup heading="Последние поиски">
                    {lastSearches
                      .sort((a, b) => b.timestamp - a.timestamp)
                      .slice(0, 5)
                      .map((item) => (
                        <CommandItem
                          key={item.search}
                          value={item.search}
                          onSelect={() => {
                            setInputValue(item.search);
                            setCurrentWord('');
                          }}
                        >
                          {item.search}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLastSearches(
                                lastSearches.filter(
                                  (s) => s.search !== item.search,
                                ),
                              );
                            }}
                            className="ml-auto"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </>
              )}
              <CommandEmpty>Ничего не найдено.</CommandEmpty>
            </CommandList>
          </div>
        </div>
      </Command>
    </div>
  );
}




