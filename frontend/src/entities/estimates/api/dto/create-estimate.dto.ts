/**
 * @file: create-estimate.dto.ts
 * @description: DTO для создания сметы
 * @created: 2025-01-04
 */

/**
 * DTO для создания новой сметы
 */
export interface CreateEstimateDto {
  workspaceId: string;
  name: string;
  description?: string;
}

