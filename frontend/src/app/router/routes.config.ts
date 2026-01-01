/**
 * @file: routes.config.ts
 * @description: Конфигурация путей роутов
 * @created: 2025-01-XX
 */

import { normalizeRoutes } from '@/shared/lib/utils';

const routes = {
  ROOT: '/',
  LOGIN: '/login',
} as const;

export const ROUTES = normalizeRoutes(routes);

