/**
 * @file: workspace-history.types.ts
 * @description: Типы для истории изменений workspace
 * @created: 2025-01-XX
 */

export enum WorkspaceHistoryAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  RESTORED = 'RESTORED',
  USER_ADDED = 'USER_ADDED',
  USER_REMOVED = 'USER_REMOVED',
  PERMANENTLY_DELETED = 'PERMANENTLY_DELETED',
}

export interface WorkspaceHistoryEntry {
  id: string;
  workspaceId: string;
  userId: string;
  action: WorkspaceHistoryAction;
  field: string | null;
  oldValue: string | null;
  newValue: string | null;
  metadata: string | null;
  createdAt: Date;
}


