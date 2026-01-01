/**
 * @file: jwtTokenStorage.ts
 * @description: Утилиты для работы с JWT токенами (access и refresh в localStorage)
 * @created: 2025-01-XX
 */

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

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
 * Сохраняет refresh token в localStorage
 */
export function setRefreshToken(token: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

/**
 * Получает refresh token из localStorage
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Удаляет refresh token из localStorage
 */
export function removeRefreshToken(): void {
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * Проверяет, есть ли refresh token
 */
export function hasRefreshToken(): boolean {
  return getRefreshToken() !== null;
}

/**
 * Очищает все токены (access и refresh)
 */
export function clearTokens(): void {
  removeAccessToken();
  removeRefreshToken();
}

