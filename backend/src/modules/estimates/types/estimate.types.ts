/**
 * @file: estimate.types.ts
 * @description: Типы для смет (Estimate)
 * @dependencies: @prisma/client
 * @created: 2025-01-04
 */

import { ColumnDataType } from '@prisma/client';

/**
 * BaseEstimate - базовый тип с общими полями estimate
 */
interface BaseEstimate {
  id: string;
  name: string;
  description: string | null;
}

/**
 * EstimateWithTimestamps - estimate с временными метками
 */
export interface EstimateWithTimestamps extends BaseEstimate {
  workspaceId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * EstimateWithCreator - estimate с информацией о создателе
 */
export interface EstimateWithCreator extends EstimateWithTimestamps {
  createdBy: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

/**
 * EstimateColumnType - тип столбца сметы
 */
export interface EstimateColumnType {
  id: string;
  estimateId: string;
  createdById: string;
  name: string;
  dataType: ColumnDataType;
  order: number;
  required: boolean;
  allowedValues: string | null; // JSON строка для ENUM
  createdAt: Date;
  updatedAt: Date;
}

/**
 * EstimateWithColumns - estimate со столбцами
 */
export interface EstimateWithColumns extends EstimateWithTimestamps {
  columns: EstimateColumnType[];
}

/**
 * EstimateFull - полная информация о смете
 */
export interface EstimateFull extends EstimateWithCreator {
  columns: EstimateColumnType[];
  rowsCount: number; // Количество строк в смете
}

