/**
 * @file: column-history.types.ts
 * @description: Типы для истории изменений столбцов
 * @created: 2025-01-04
 */

/**
 * Действия в истории столбца
 */
export enum ColumnHistoryAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  PERMISSION_CHANGED = 'PERMISSION_CHANGED',
}

/**
 * ColumnHistoryType - запись истории изменений столбца
 */
export interface ColumnHistoryType {
  id: string;
  columnId: string;
  userId: string;
  action: string;
  field: string | null;
  oldValue: string | null;
  newValue: string | null;
  metadata: string | null;
  createdAt: Date;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

