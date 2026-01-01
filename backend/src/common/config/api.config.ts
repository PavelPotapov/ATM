/**
 * @file: api.config.ts
 * @description: Конфигурация API (версия, префиксы, пути)
 * @created: 2025-01-XX
 */

/**
 * Версия API
 * Используется для версионирования эндпоинтов: /api/v1/...
 */
export const API_VERSION = 'v1';

/**
 * Базовый путь для статических файлов (assets)
 */
export const ASSETS_PATH = '/assets';

/**
 * Базовый путь для API (без версии)
 * В production: /api
 * В development: пустая строка (или можно использовать /api для единообразия)
 */
export const API_BASE_PATH =
  process.env.NODE_ENV === 'production' ? '/api' : '';

/**
 * Базовый префикс API с версией
 * Production: api/v1
 * Development: v1
 */
export const getApiPrefix = (): string => {
  if (process.env.NODE_ENV === 'production') {
    return `${API_BASE_PATH.slice(1)}/${API_VERSION}`; // Убираем ведущий / и добавляем версию
  }
  return API_VERSION;
};

/**
 * Полный путь API с версией (для проверки запросов)
 * Production: /api/v1
 * Development: /v1
 */
export const getApiPath = (): string => {
  const prefix = getApiPrefix();
  return `/${prefix}`;
};
