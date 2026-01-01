/**
 * @file: endpoints.config.ts
 * @description: Константы эндпоинтов API
 * @created: 2025-01-XX
 */

import { normalizePath } from '@/shared/lib/utils';

const endpoints = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
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

// Нормализуем строковые константы
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: normalizePath(endpoints.AUTH.LOGIN),
    REFRESH: normalizePath(endpoints.AUTH.REFRESH),
    LOGOUT: normalizePath(endpoints.AUTH.LOGOUT),
  },
  WORKSPACES: {
    LIST: normalizePath(endpoints.WORKSPACES.LIST),
    BY_ID: (id: string) => normalizePath(endpoints.WORKSPACES.BY_ID(id)),
    ADD_USER: (id: string) => normalizePath(endpoints.WORKSPACES.ADD_USER(id)),
    REMOVE_USER: (id: string, userId: string) => normalizePath(endpoints.WORKSPACES.REMOVE_USER(id, userId)),
  },
  USERS: {
    LIST: normalizePath(endpoints.USERS.LIST),
    BY_ID: (id: string) => normalizePath(endpoints.USERS.BY_ID(id)),
  },
} as const;

