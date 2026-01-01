/**
 * @file: endpoints.config.ts
 * @description: Константы эндпоинтов API
 * @created: 2025-01-XX
 */

import { normalizePath } from '@/shared/lib/utils';

/**
 * Версия API (должна совпадать с backend/src/common/config/api.config.ts)
 */
const API_VERSION = 'v1';

/**
 * Префикс для API
 * 
 * Единообразно используется /api/v1 и в development, и в production
 * для согласованности с бэкендом
 */
const API_PREFIX = `/api/${API_VERSION}`;

const endpoints = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  WORKSPACES: {
    LIST: '/workspaces',
    BY_ID: (id: string) => `/workspaces/${id}`,
    ADD_USER: (id: string) => `/workspaces/${id}/users`,
    REMOVE_USER: (id: string, userId: string) => `/workspaces/${id}/users/${userId}`,
  },
  USERS: {
    LIST: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },
} as const;

// Нормализуем строковые константы и добавляем префикс
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: normalizePath(`${API_PREFIX}${endpoints.AUTH.LOGIN}`),
    REFRESH: normalizePath(`${API_PREFIX}${endpoints.AUTH.REFRESH}`),
    LOGOUT: normalizePath(`${API_PREFIX}${endpoints.AUTH.LOGOUT}`),
    ME: normalizePath(`${API_PREFIX}${endpoints.AUTH.ME}`),
  },
  WORKSPACES: {
    LIST: normalizePath(`${API_PREFIX}${endpoints.WORKSPACES.LIST}`),
    BY_ID: (id: string) =>
      normalizePath(`${API_PREFIX}${endpoints.WORKSPACES.BY_ID(id)}`),
    ADD_USER: (id: string) =>
      normalizePath(`${API_PREFIX}${endpoints.WORKSPACES.ADD_USER(id)}`),
    REMOVE_USER: (id: string, userId: string) =>
      normalizePath(
        `${API_PREFIX}${endpoints.WORKSPACES.REMOVE_USER(id, userId)}`,
      ),
  },
  USERS: {
    LIST: normalizePath(`${API_PREFIX}${endpoints.USERS.LIST}`),
    BY_ID: (id: string) =>
      normalizePath(`${API_PREFIX}${endpoints.USERS.BY_ID(id)}`),
  },
} as const;

