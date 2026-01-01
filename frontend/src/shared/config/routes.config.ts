/**
 * @file: routes.config.ts
 * @description: Конфигурация путей роутов (общие константы для всех слоев)
 * @created: 2025-01-XX
 */

import { normalizeRoutes } from '@/shared/lib/utils';

const routes = {
  ROOT: '/',
  LOGIN: '/login',
  WORKSPACES: '/workspaces',
  USERS: '/users',
} as const;

export const ROUTES = normalizeRoutes(routes);

