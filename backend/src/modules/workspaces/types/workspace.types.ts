/**
 * @file: workspace.types.ts
 * @description: Типы для рабочего пространства (Workspace)
 * @dependencies: @prisma/client
 * @created: 2025-12-07
 */

/**
 * BaseWorkspace - базовый тип с общими полями workspace
 */
interface BaseWorkspace {
  id: string;
  name: string;
  description: string | null;
}

/**
 * WorkspaceWithTimestamps - workspace с временными метками
 */
export interface WorkspaceWithTimestamps extends BaseWorkspace {
  createdAt: Date;
  updatedAt: Date;
}

/**
 * WorkspaceWithUsers - workspace с информацией о пользователях
 */
export interface WorkspaceWithUsers extends WorkspaceWithTimestamps {
  users: Array<{
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
  }>;
}
