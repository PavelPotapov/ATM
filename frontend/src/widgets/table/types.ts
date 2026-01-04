/**
 * @file: types.ts
 * @description: Типы для компонентов таблицы
 * @dependencies: @tanstack/react-table
 * @created: 2025-01-04
 */

import type { JSX } from 'react';

export type DatePreset = {
  label: string;
  from: Date;
  to: Date;
  shortcut: string;
};

export type Option = {
  label: string;
  value: string | boolean | number | undefined;
};

export type Input = {
  type: 'input';
  options?: Option[];
};

export type Checkbox = {
  type: 'checkbox';
  component?: (props: Option) => JSX.Element | null;
  options?: Option[];
};

export type Slider = {
  type: 'slider';
  min: number;
  max: number;
  options?: Option[];
};

export type Timerange = {
  type: 'timerange';
  options?: Option[];
  presets?: DatePreset[];
};

export type Base<TData> = {
  label: string;
  value: keyof TData;
  /**
   * Определяет, открыт ли аккордеон в панели фильтров по умолчанию
   */
  defaultOpen?: boolean;
  /**
   * Определяет, отключен ли command input для этого поля
   */
  commandDisabled?: boolean;
};

export type DataTableCheckboxFilterField<TData> = Base<TData> & Checkbox;
export type DataTableSliderFilterField<TData> = Base<TData> & Slider;
export type DataTableInputFilterField<TData> = Base<TData> & Input;
export type DataTableTimerangeFilterField<TData> = Base<TData> & Timerange;

export type DataTableFilterField<TData> =
  | DataTableCheckboxFilterField<TData>
  | DataTableSliderFilterField<TData>
  | DataTableInputFilterField<TData>
  | DataTableTimerangeFilterField<TData>;

export type SheetField<TData, TMeta = Record<string, unknown>> = {
  id: keyof TData;
  label: string;
  type: 'readonly' | 'input' | 'checkbox' | 'slider' | 'timerange';
  component?: (
    props: TData & {
      metadata?: {
        totalRows: number;
        filterRows: number;
        totalRowsFetched: number;
      } & TMeta;
    },
  ) => JSX.Element | null | string;
  condition?: (props: TData) => boolean;
  className?: string;
  skeletonClassName?: string;
};

