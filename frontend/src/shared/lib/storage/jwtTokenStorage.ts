/**
 * @file: jwtTokenStorage.ts
 * @description: Утилиты для работы с JWT токенами (access в localStorage, refresh в httpOnly cookie)
 * @created: 2025-01-XX
 */

const ACCESS_TOKEN_KEY = 'accessToken';

/**
 * Сохраняет access token в localStorage
 */
export function setAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

/**
 * Получает access token из localStorage
 */
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Удаляет access token из localStorage
 */
export function removeAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

/**
 * Проверяет, есть ли access token
 */
export function hasAccessToken(): boolean {
  return getAccessToken() !== null;
}

/**
 * Refresh token хранится в httpOnly cookie на бэкенде
 * Для работы с ним используем API endpoints
 */

