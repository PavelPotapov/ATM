/**
 * @file: index.ts
 * @description: Публичный API модуля workspaces
 * @created: 2025-01-XX
 */

// Экспорт типов
export type { WorkspaceDto } from './dto/workspace.dto';

// Экспорт query keys
export { workspacesKeys } from './queryKeys';

// Экспорт queries (опционально, если нужны напрямую)
export { getWorkspaces } from './queries/getWorkspaces';
export { getWorkspaceById } from './queries/getWorkspaceById';
export { addUserToWorkspace } from './queries/addUserToWorkspace';

// Экспорт hooks (основной способ использования)
export { useWorkspaces } from './hooks/useWorkspaces';
export { useWorkspace } from './hooks/useWorkspace';

