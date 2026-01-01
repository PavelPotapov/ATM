/**
 * @file: request.util.ts
 * @description: Утилиты для работы с HTTP запросами
 * @created: 2025-01-XX
 */

import type { Request } from 'express';
import { ASSETS_PATH, getApiPath } from '../config/api.config';

/**
 * Проверяет, является ли запрос запросом статического файла
 * @param path - путь запроса
 * @returns true, если это запрос статического файла
 */
export function isStaticFileRequest(path: string): boolean {
  return path.startsWith(ASSETS_PATH) || path.includes('.');
}

/**
 * Проверяет, является ли запрос API запросом
 * @param path - путь запроса
 * @returns true, если это API запрос
 */
export function isApiRequest(path: string): boolean {
  const apiPath = getApiPath();
  // Проверяем, начинается ли путь с API пути (например, /api/v1 или /v1)
  // Также проверяем /api для обратной совместимости
  return path.startsWith(apiPath) || path.startsWith('/api');
}

/**
 * Проверяет, является ли запрос SPA роутом (нужно отдать index.html)
 * @param req - Express request объект
 * @returns true, если это SPA роут
 */
export function isSpaRoute(req: Request): boolean {
  const path = req.path;
  return !isStaticFileRequest(path) && !isApiRequest(path);
}
