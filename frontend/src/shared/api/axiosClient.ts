/**
 * @file: axiosClient.ts
 * @description: Axios клиент для работы с API. Автоматическая JWT-авторизация и refresh token через httpOnly cookie.
 * @dependencies: axios, jwtTokenStorage
 * @created: 2025-01-XX
 */

import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import {
  getAccessToken,
  setAccessToken,
  clearTokens,
} from '@/shared/lib/storage/jwtTokenStorage';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';
import { ROUTES } from '@/shared/config/routes.config';

// Базовый URL API
// В production: пустая строка (относительные пути — текущий домен)
// В development: VITE_API_URL из .env или localhost
const API_BASE_URL = import.meta.env.PROD
  ? ''
  : import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Promise для предотвращения множественных запросов refresh
let refreshPromise: Promise<string> | null = null;

/**
 * Выполняет refresh токена через httpOnly cookie.
 * Если уже идёт refresh, возвращает существующий Promise.
 */
async function refreshToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      // Cookie отправляется автоматически благодаря withCredentials
      const response = await axios.post<{ access_token: string }>(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
        {},
        { withCredentials: true },
      );

      const { access_token } = response.data;
      setAccessToken(access_token);
      return access_token;
    } catch (refreshError) {
      clearTokens();
      const { router } = await import('@/app/router');
      router.navigate({ to: ROUTES.LOGIN });
      throw refreshError;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// Создаём экземпляр axios
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Отправляем cookies (refresh_token) с каждым запросом
});

// Интерцептор: добавление JWT access token в заголовки
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Интерцептор: обработка 401 и автоматический refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      const url = originalRequest.url || '';
      if (url.includes('/auth/refresh') || url.includes('/auth/login')) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return apiClient(originalRequest);
      } catch {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);
