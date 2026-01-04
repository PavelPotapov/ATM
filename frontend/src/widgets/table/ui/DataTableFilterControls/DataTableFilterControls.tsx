/**
 * @file: DataTableFilterControls.tsx
 * @description: Панель фильтров с аккордеоном
 * @dependencies: useDataTable, Accordion, DataTableFilterCheckbox, DataTableFilterInput, DataTableFilterSlider
 * @created: 2025-01-04
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/ui/accordion';
import { DataTableFilterResetButton } from '../DataTableFilterResetButton';
import { DataTableFilterChips } from '../DataTableFilterChips';
import { DataTableFilterCheckbox } from '../DataTableFilterCheckbox';
import { DataTableFilterSlider } from '../DataTableFilterSlider';
import { DataTableFilterInput } from '../DataTableFilterInput';
import { useDataTable } from '../../lib';

export function DataTableFilterControls() {
  const { filterFields } = useDataTable();
  return (
    <Accordion
      type="multiple"
      defaultValue={filterFields
        ?.filter(({ defaultOpen }) => defaultOpen)
        ?.map(({ value }) => value as string)}
    >
      {filterFields?.map((field) => {
        const value = field.value as string;
        return (
          <AccordionItem key={value} value={value} className="border-none">
            <AccordionTrigger className="w-full px-2 py-0 hover:no-underline data-[state=closed]:text-muted-foreground data-[state=open]:text-foreground focus-within:data-[state=closed]:text-foreground hover:data-[state=closed]:text-foreground">
              <div className="flex w-full flex-col gap-2 py-2 pr-2">
                <div className="flex w-full items-center justify-between gap-2 truncate">
                  <div className="flex items-center gap-2 truncate">
                    <p className="text-sm font-medium">{field.label}</p>
                    {value !== field.label.toLowerCase() &&
                    !field.commandDisabled ? (
                      <p className="mt-px truncate font-mono text-[10px] text-muted-foreground">
                        {value}
                      </p>
                    ) : null}
                  </div>
                </div>
                {/* Показываем отдельные чипы для каждого выбранного значения */}
                {field.type === 'checkbox' && (
                  <DataTableFilterChips field={field} />
                )}
                {/* Для input фильтров тоже показываем чипы с актуальным значением */}
                {field.type === 'input' && (
                  <DataTableFilterChips field={field} />
                )}
                {/* Для других типов фильтров показываем одну кнопку сброса */}
                {field.type !== 'checkbox' && field.type !== 'input' && (
                  <DataTableFilterResetButton {...field} />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-1">
                {(() => {
                  switch (field.type) {
                    case 'checkbox': {
                      return <DataTableFilterCheckbox {...field} />;
                    }
                    case 'slider': {
                      return <DataTableFilterSlider {...field} />;
                    }
                    case 'input': {
                      return <DataTableFilterInput {...field} />;
                    }
                    case 'timerange': {
                      // TODO: реализовать DataTableFilterTimerange
                      return null;
                    }
                  }
                })()}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

