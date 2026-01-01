"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Command as CommandPrimitive } from "cmdk";

import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";

export interface Option {
  label: string;
  value: string;
  disable?: boolean;
}

interface MultipleSelectorProps {
  value?: Option[];
  defaultOptions?: Option[];
  onValueChange?: (options: Option[]) => void;
  placeholder?: string;
  emptyIndicator?: React.ReactNode;
  maxCount?: number;
  onMaxSelected?: (maxLimit: number) => void;
  hidePlaceholderWhenSelected?: boolean;
  disabled?: boolean;
  className?: string;
  creatable?: boolean;
  createGroup?: string;
}

const MultipleSelector = React.forwardRef<
  HTMLDivElement,
  MultipleSelectorProps
>(
  (
    {
      value,
      defaultOptions: defaultValue,
      onValueChange,
      placeholder = "Select items...",
      emptyIndicator,
      maxCount = 0,
      onMaxSelected,
      hidePlaceholderWhenSelected = false,
      disabled = false,
      className,
      creatable = false,
      createGroup = "Создать",
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState<Option[]>(value || []);
    const [inputValue, setInputValue] = React.useState("");

    const handleUnselect = React.useCallback(
      (option: Option) => {
        const newSelected = selected.filter((s) => s.value !== option.value);
        setSelected(newSelected);
        onValueChange?.(newSelected);
      },
      [onValueChange, selected]
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current;
        if (input) {
          if (e.key === "Delete" || e.key === "Backspace") {
            if (input.value === "" && selected.length > 0) {
              handleUnselect(selected[selected.length - 1]);
            }
          }
          if (e.key === "Escape") {
            input.blur();
          }
        }
      },
      [handleUnselect, selected]
    );

    const selectables = React.useMemo<Option[]>(
      () =>
        defaultValue?.filter(
          (option) => !selected.some((s) => s.value === option.value)
        ) ?? [],
      [defaultValue, selected]
    );

    const handleSelect = React.useCallback(
      (option: Option) => {
        if (
          selected.length >= maxCount &&
          maxCount > 0 &&
          !selected.some((s) => s.value === option.value)
        ) {
          onMaxSelected?.(maxCount);
          return;
        }

        const newSelected = [...selected, option];
        setSelected(newSelected);
        onValueChange?.(newSelected);
        setInputValue("");
      },
      [maxCount, onMaxSelected, onValueChange, selected]
    );

    const handleCreatable = React.useCallback(() => {
      if (creatable && inputValue.trim()) {
        const newOption = { label: inputValue, value: inputValue };
        handleSelect(newOption);
        setInputValue("");
      }
    }, [creatable, inputValue, handleSelect]);

    React.useEffect(() => {
      if (value) {
        setSelected(value);
      }
    }, [value]);

    return (
      <Command
        onKeyDown={handleKeyDown}
        className={cn("overflow-visible bg-transparent", className)}
        shouldFilter={true}
        filter={(value, search) => {
          // value - это значение CommandItem (option.value)
          // search - это текст из CommandPrimitive.Input
          const option = selectables.find((opt) => opt.value === value);
          if (!option) {
            // Для creatable элементов
            if (creatable && value.startsWith('__create__')) {
              const createValue = value.replace('__create__', '');
              if (!search || search.trim() === '') return 0;
              return createValue.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
            }
            return 0;
          }
          if (!search || search.trim() === '') return 1;
          // Фильтруем по label
          return option.label.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
        }}
        {...props}
      >
        <div
          ref={ref}
          className={cn(
            "group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <div className="flex flex-wrap gap-1">
            {selected.map((option) => {
              return (
                <Badge
                  key={option.value}
                  variant="secondary"
                  className={cn(
                    "data-disabled:bg-muted data-disabled:text-muted-foreground data-disabled:hover:bg-muted",
                    option.disable && "cursor-not-allowed"
                  )}
                  data-disabled={disabled || option.disable}
                >
                  {option.label}
                  <button
                    className={cn(
                      "ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      (disabled || option.disable) && "hidden"
                    )}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(option);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(option)}
                    type="button"
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              );
            })}
            <CommandPrimitive.Input
              ref={inputRef}
              value={inputValue}
              onValueChange={setInputValue}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              disabled={disabled}
              placeholder={
                hidePlaceholderWhenSelected && selected.length !== 0
                  ? ""
                  : placeholder
              }
              className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="relative mt-2">
          <CommandList>
            {open && (
              <div className="absolute top-0 z-50 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
                <CommandGroup className="h-full overflow-auto max-h-64">
                  {selectables.map((option) => {
                    return (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disable}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onSelect={() => {
                          handleSelect(option);
                        }}
                        className="cursor-pointer"
                      >
                        {option.label}
                      </CommandItem>
                    );
                  })}
                  {creatable && inputValue.trim() && !selectables.some(opt => opt.label.toLowerCase() === inputValue.toLowerCase()) && (
                    <CommandItem
                      value={`__create__${inputValue}`}
                      onSelect={handleCreatable}
                      className="bg-accent cursor-pointer"
                    >
                      {createGroup} "{inputValue}"
                    </CommandItem>
                  )}
                  <CommandEmpty>
                    {emptyIndicator || "No results found."}
                  </CommandEmpty>
                </CommandGroup>
              </div>
            )}
          </CommandList>
        </div>
      </Command>
    );
  }
);

MultipleSelector.displayName = "MultipleSelector";

export { MultipleSelector };
