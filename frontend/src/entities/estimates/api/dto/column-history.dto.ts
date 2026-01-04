/**
 * @file: column-history.dto.ts
 * @description: DTO для истории изменений столбца
 * @created: 2025-01-04
 */

/**
 * DTO для записи истории изменений столбца
 */
export interface ColumnHistoryDto {
  id: string;
  columnId: string;
  userId: string;
  action: string;
  field: string | null;
  oldValue: string | null;
  newValue: string | null;
  metadata: string | null;
  createdAt: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

