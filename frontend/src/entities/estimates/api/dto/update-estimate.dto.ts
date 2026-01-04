/**
 * @file: update-estimate.dto.ts
 * @description: DTO для обновления сметы
 * @created: 2025-01-04
 */

/**
 * DTO для обновления сметы (все поля опциональны)
 */
export interface UpdateEstimateDto {
  workspaceId?: string;
  name?: string;
  description?: string;
}

