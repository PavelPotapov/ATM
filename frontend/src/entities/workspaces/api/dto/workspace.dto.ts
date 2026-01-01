/**
 * @file: workspace.dto.ts
 * @description: DTO для Workspace
 * @created: 2025-01-XX
 */

export interface WorkspaceDto {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

