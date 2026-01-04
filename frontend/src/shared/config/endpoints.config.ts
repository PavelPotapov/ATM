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
    PERMISSIONS: '/auth/permissions',
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
    DELETE: (id: string) => `/users/${id}`,
    CREATE: '/users',
  },
  ESTIMATES: {
    LIST: '/estimates',
    BY_WORKSPACE: (workspaceId: string) => `/estimates/workspace/${workspaceId}`,
    BY_ID: (id: string) => `/estimates/${id}`,
    CREATE: '/estimates',
    UPDATE: (id: string) => `/estimates/${id}`,
    DELETE: (id: string) => `/estimates/${id}`,
    CREATE_COLUMN: (estimateId: string) => `/estimates/${estimateId}/columns`,
    UPDATE_COLUMN: (columnId: string) => `/estimates/columns/${columnId}`,
    DELETE_COLUMN: (columnId: string) => `/estimates/columns/${columnId}`,
    GET_COLUMN_FULL: (columnId: string) => `/estimates/columns/${columnId}`,
    GET_COLUMN_HISTORY: (columnId: string) => `/estimates/columns/${columnId}/history`,
    CREATE_COLUMN_PERMISSION: (columnId: string) => `/estimates/columns/${columnId}/permissions`,
    UPDATE_COLUMN_PERMISSION: (permissionId: string) => `/estimates/columns/permissions/${permissionId}`,
    DELETE_COLUMN_PERMISSION: (permissionId: string) => `/estimates/columns/permissions/${permissionId}`,
  },
} as const;

// Нормализуем строковые константы и добавляем префикс
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: normalizePath(`${API_PREFIX}${endpoints.AUTH.LOGIN}`),
    REFRESH: normalizePath(`${API_PREFIX}${endpoints.AUTH.REFRESH}`),
    LOGOUT: normalizePath(`${API_PREFIX}${endpoints.AUTH.LOGOUT}`),
    ME: normalizePath(`${API_PREFIX}${endpoints.AUTH.ME}`),
    PERMISSIONS: normalizePath(`${API_PREFIX}${endpoints.AUTH.PERMISSIONS}`),
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
    DELETE: (id: string) =>
      normalizePath(`${API_PREFIX}${endpoints.USERS.DELETE(id)}`),
    CREATE: normalizePath(`${API_PREFIX}${endpoints.USERS.CREATE}`),
  },
  ESTIMATES: {
    LIST: normalizePath(`${API_PREFIX}${endpoints.ESTIMATES.LIST}`),
    BY_WORKSPACE: (workspaceId: string) =>
      normalizePath(`${API_PREFIX}${endpoints.ESTIMATES.BY_WORKSPACE(workspaceId)}`),
    BY_ID: (id: string) =>
      normalizePath(`${API_PREFIX}${endpoints.ESTIMATES.BY_ID(id)}`),
    CREATE: normalizePath(`${API_PREFIX}${endpoints.ESTIMATES.CREATE}`),
    UPDATE: (id: string) =>
      normalizePath(`${API_PREFIX}${endpoints.ESTIMATES.UPDATE(id)}`),
    DELETE: (id: string) =>
      normalizePath(`${API_PREFIX}${endpoints.ESTIMATES.DELETE(id)}`),
    CREATE_COLUMN: (estimateId: string) =>
      normalizePath(`${API_PREFIX}${endpoints.ESTIMATES.CREATE_COLUMN(estimateId)}`),
    UPDATE_COLUMN: (columnId: string) =>
      normalizePath(`${API_PREFIX}${endpoints.ESTIMATES.UPDATE_COLUMN(columnId)}`),
    DELETE_COLUMN: (columnId: string) =>
      normalizePath(`${API_PREFIX}${endpoints.ESTIMATES.DELETE_COLUMN(columnId)}`),
    GET_COLUMN_FULL: (columnId: string) =>
      normalizePath(`${API_PREFIX}${endpoints.ESTIMATES.GET_COLUMN_FULL(columnId)}`),
    GET_COLUMN_HISTORY: (columnId: string) =>
      normalizePath(`${API_PREFIX}${endpoints.ESTIMATES.GET_COLUMN_HISTORY(columnId)}`),
    CREATE_COLUMN_PERMISSION: (columnId: string) =>
      normalizePath(`${API_PREFIX}${endpoints.ESTIMATES.CREATE_COLUMN_PERMISSION(columnId)}`),
    UPDATE_COLUMN_PERMISSION: (permissionId: string) =>
      normalizePath(`${API_PREFIX}${endpoints.ESTIMATES.UPDATE_COLUMN_PERMISSION(permissionId)}`),
    DELETE_COLUMN_PERMISSION: (permissionId: string) =>
      normalizePath(`${API_PREFIX}${endpoints.ESTIMATES.DELETE_COLUMN_PERMISSION(permissionId)}`),
  },
} as const;

