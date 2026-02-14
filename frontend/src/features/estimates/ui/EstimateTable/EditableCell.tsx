/**
 * @file: EditableCell.tsx
 * @description: Компонент редактируемой ячейки таблицы
 * @dependencies: Input, Select, shared/ui
 * @created: 2025-01-04
 */

import { useState, useEffect } from 'react';
import * as React from 'react';
import { Input } from '@/shared/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import type { ColumnDataType } from '@/entities/estimates';

interface EditableCellProps {
  value: string | null;
  cellId: string | null;
  rowId: string;
  columnId: string;
  dataType: ColumnDataType;
  canEdit: boolean;
  allowedValues?: string[] | null;
  onUpdate: (value: string) => void;
  isUpdating?: boolean;
}

/**
 * Компонент редактируемой ячейки
 * Поддерживает разные типы данных: STRING, NUMBER, ENUM, BOOLEAN, DATE
 */
export function EditableCell({
  value,
  cellId: _cellId,
  rowId: _rowId,
  columnId: _columnId,
  dataType,
  canEdit,
  allowedValues,
  onUpdate,
  isUpdating = false,
}: EditableCellProps) {
  const [localValue, setLocalValue] = useState(value ?? '');
  const [isEditing, setIsEditing] = useState(false);
  const lastSavedValueRef = React.useRef<string | null>(value ?? null);
  const justSavedRef = React.useRef(false);
  const savedValueRef = React.useRef<string | null>(null);

  // Синхронизируем локальное значение с пропсом, но не сразу после сохранения
  useEffect(() => {
    // Если мы только что сохранили значение, не синхронизируем сразу
    if (justSavedRef.current) {
      // Проверяем, совпадает ли новое значение с тем, что мы сохранили
      const normalizedValue = value ?? '';
      const normalizedSaved = savedValueRef.current ?? '';
      const normalizedLocal = localValue ?? '';
      
      // Если значение совпадает с сохраненным - обновляем refs и не меняем localValue
      if (normalizedValue === normalizedSaved) {
        lastSavedValueRef.current = value ?? null;
        savedValueRef.current = null;
        // Сбрасываем флаг через небольшую задержку, чтобы дать время оптимистичному обновлению
        const timer = setTimeout(() => {
          justSavedRef.current = false;
        }, 250);
        return () => clearTimeout(timer);
      }
      
      // Если localValue совпадает с сохраненным, но value еще не обновился - ждем
      if (normalizedLocal === normalizedSaved && normalizedValue !== normalizedSaved) {
        const timer = setTimeout(() => {
          justSavedRef.current = false;
        }, 300);
        return () => clearTimeout(timer);
      }
      
      // Если значение не совпадает - возможно, пришло другое значение извне
      // Но все равно не синхронизируем сразу, чтобы избежать мигания
      const timer = setTimeout(() => {
        justSavedRef.current = false;
      }, 300);
      return () => clearTimeout(timer);
    }

    // Если значение изменилось извне (не от нашего сохранения)
    const normalizedValue = value ?? '';
    const normalizedLastSaved = lastSavedValueRef.current ?? '';

    if (normalizedValue !== normalizedLastSaved) {
      setLocalValue(normalizedValue);
      lastSavedValueRef.current = value ?? null;
    }
  }, [value, localValue]);

  // Если нельзя редактировать - показываем только для чтения
  if (!canEdit) {
    return (
      <div className="px-2 py-1 text-sm">
        {formatValueForDisplay(value, dataType) || (
          <span className="text-muted-foreground italic">—</span>
        )}
      </div>
    );
  }


  const handleBlur = () => {
    setIsEditing(false);
    if (localValue !== (value ?? '')) {
      justSavedRef.current = true;
      lastSavedValueRef.current = localValue;
      onUpdate(localValue);
      // Сбрасываем флаг через небольшую задержку
      setTimeout(() => {
        justSavedRef.current = false;
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setLocalValue(value ?? '');
      setIsEditing(false);
    }
  };

  // BOOLEAN - чекбокс или селект
  if (dataType === 'BOOLEAN') {
    return (
      <div className="px-2 py-1" data-editable-cell>
        <Select
          value={localValue || 'false'}
          onValueChange={(val) => {
            setLocalValue(val);
            justSavedRef.current = true;
            savedValueRef.current = val;
            lastSavedValueRef.current = val;
            onUpdate(val);
          }}
          disabled={isUpdating}
          onOpenChange={(open) => {
            if (open) {
              // Предотвращаем открытие сайдбара при открытии селекта
              setTimeout(() => {
                const event = new Event('click', { bubbles: false });
                document.dispatchEvent(event);
              }, 0);
            }
          }}
        >
          <SelectTrigger
            className="h-8 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Да</SelectItem>
            <SelectItem value="false">Нет</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }

  // ENUM - селект с разрешенными значениями
  if (dataType === 'ENUM' && allowedValues && allowedValues.length > 0) {
    return (
      <div className="px-2 py-1" data-editable-cell>
        <Select
          value={localValue || ''}
          onValueChange={(val) => {
            setLocalValue(val);
            justSavedRef.current = true;
            savedValueRef.current = val;
            lastSavedValueRef.current = val;
            onUpdate(val);
          }}
          disabled={isUpdating}
          onOpenChange={(open) => {
            if (open) {
              // Предотвращаем открытие сайдбара при открытии селекта
              setTimeout(() => {
                const event = new Event('click', { bubbles: false });
                document.dispatchEvent(event);
              }, 0);
            }
          }}
        >
          <SelectTrigger
            className="h-8 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <SelectValue placeholder="Выберите значение" />
          </SelectTrigger>
          <SelectContent>
            {allowedValues.map((val) => (
              <SelectItem key={val} value={val}>
                {val}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // DATE - input type="date"
  if (dataType === 'DATE') {
    return (
      <div className="px-2 py-1" data-editable-cell>
        <Input
          type="date"
          value={localValue || ''}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={isUpdating}
          className="h-8 text-sm"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  }

  // NUMBER - input type="number" с валидацией
  if (dataType === 'NUMBER') {
    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      // Разрешаем пустое значение, минус, точку и цифры
      if (val === '' || val === '-' || /^-?\d*\.?\d*$/.test(val)) {
        setLocalValue(val);
      }
    };

    const handleNumberBlur = () => {
      setIsEditing(false);
      // Валидация: если значение не пустое, проверяем что это число
      if (localValue && localValue !== '-') {
        const numValue = Number.parseFloat(localValue);
        if (Number.isNaN(numValue)) {
          // Если не число - возвращаем старое значение
          setLocalValue(value ?? '');
          return;
        }
        // Сохраняем как строку (API ожидает строку)
        const stringValue = String(numValue);
        justSavedRef.current = true;
        lastSavedValueRef.current = stringValue;
        onUpdate(stringValue);
        setTimeout(() => {
          justSavedRef.current = false;
        }, 100);
      } else if (localValue !== (value ?? '')) {
        justSavedRef.current = true;
        lastSavedValueRef.current = localValue;
        onUpdate(localValue);
        setTimeout(() => {
          justSavedRef.current = false;
        }, 100);
      }
    };

    return (
      <div className="px-2 py-1" data-editable-cell>
        {isEditing ? (
          <Input
            type="text"
            inputMode="decimal"
            value={localValue}
            onChange={handleNumberChange}
            onBlur={handleNumberBlur}
            onKeyDown={handleKeyDown}
            disabled={isUpdating}
            className="h-8 text-sm"
            autoFocus
            onClick={(e) => e.stopPropagation()}
            placeholder="Введите число"
          />
        ) : (
          <div
            className="h-8 px-2 py-1 text-sm cursor-text hover:bg-muted rounded"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            {formatValueForDisplay(value, dataType)}
          </div>
        )}
      </div>
    );
  }

  // STRING - обычный input
  return (
    <div className="px-2 py-1" data-editable-cell>
      {isEditing ? (
        <Input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          disabled={isUpdating}
          className="h-8 text-sm"
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div
          className="h-8 px-2 py-1 text-sm cursor-text hover:bg-muted rounded flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
        >
          {formatValueForDisplay(value, dataType) || (
            <span className="text-muted-foreground italic">Пусто</span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Форматирует значение для отображения
 */
function formatValueForDisplay(value: string | null, dataType: ColumnDataType): string {
  if (!value) return '';

  switch (dataType) {
    case 'BOOLEAN':
      return value === 'true' ? 'Да' : 'Нет';
    case 'NUMBER':
      return value;
    case 'DATE':
      try {
        return new Date(value).toLocaleDateString('ru-RU');
      } catch {
        return value;
      }
    default:
      return value;
  }
}

