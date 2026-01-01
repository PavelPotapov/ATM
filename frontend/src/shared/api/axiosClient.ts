/**
 * @file: axiosClient.ts
 * @description: Axios клиент для работы с API
 * @dependencies: axios
 * @created: 2025-01-XX
 */

import axios, { AxiosError } from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import {
  getAccessToken,
  setAccessToken,
  getRefreshToken,
  setRefreshToken,
  clearTokens,
} from '@/shared/lib/storage/jwtTokenStorage';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';
import { ROUTES } from '@/shared/config/routes.config';

// Базовый URL API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Promise для предотвращения множественных запросов refresh
let refreshPromise: Promise<string> | null = null;

/**
 * Выполняет refresh токена
 * Если уже идет refresh, возвращает существующий Promise
 */
async function refreshToken(): Promise<string> {
  // Если уже идет refresh, возвращаем существующий Promise
  if (refreshPromise) {
    return refreshPromise;
  }

  // Создаем новый Promise для refresh
  refreshPromise = (async () => {
    try {
      const refreshTokenValue = getRefreshToken();
      
      if (!refreshTokenValue) {
        throw new Error('Refresh token не найден');
      }

      // Отправляем refresh token в теле запроса
      const response = await axios.post<{ access_token: string; refresh_token?: string }>(
        `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
        { refresh_token: refreshTokenValue }
      );

      const { access_token, refresh_token } = response.data;
      setAccessToken(access_token);
      
      // Если бэкенд вернул новый refresh token, обновляем его
      if (refresh_token) {
        setRefreshToken(refresh_token);
      }
      
      return access_token;
    } catch (refreshError) {
      // Очищаем все токены при ошибке refresh
      clearTokens();
      // Редирект на страницу логина через роутер
      // Используем динамический импорт, чтобы избежать циклических зависимостей
      const { router } = await import('@/app/router');
      router.navigate({ to: ROUTES.LOGIN });
      throw refreshError;
    } finally {
      // Очищаем Promise после завершения
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// Создаем экземпляр axios
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // withCredentials не нужен, так как refresh token хранится в localStorage
  // и отправляется в теле запроса
});

// Интерцептор для добавления JWT токена в заголовки
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
  }
);

// Интерцептор для обработки ошибок и refresh token
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Если ошибка 401 и это не запрос на refresh/login
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Проверяем, не является ли это запросом на refresh или login
      const url = originalRequest.url || '';
      if (url.includes('/auth/refresh') || url.includes('/auth/login')) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Получаем новый токен (если уже идет refresh, вернется существующий Promise)
        const newToken = await refreshToken();
        
        // Обновляем заголовок и повторяем запрос
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return apiClient(originalRequest);
      } catch {
        // Если refresh не удался, запрос отклоняется
        // Редирект уже выполнен в refreshToken()
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

