/**
 * @file: userStorage.ts
 * @description: Утилиты для работы с данными пользователя в localStorage
 * @created: 2025-01-XX
 */

import type { AuthResponse } from '@/features/authLogin/api/dto/auth.dto';

const USER_KEY = 'user';

/**
 * Сохраняет данные пользователя в localStorage
 */
export function setUser(user: AuthResponse['user']): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Получает данные пользователя из localStorage
 */
export function getUser(): AuthResponse['user'] | null {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) {
    return null;
  }
  try {
    return JSON.parse(userStr) as AuthResponse['user'];
  } catch {
    return null;
  }
}

/**
 * Удаляет данные пользователя из localStorage
 */
export function removeUser(): void {
  localStorage.removeItem(USER_KEY);
}

/**
 * Проверяет, есть ли данные пользователя
 */
export function hasUser(): boolean {
  return getUser() !== null;
}

