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
 * Единообразно используется /api и в development, и в production
 */
export const API_BASE_PATH = '/api';

/**
 * Базовый префикс API с версией
 * Всегда: api/v1 (единообразно для development и production)
 */
export const getApiPrefix = (): string => {
  return `${API_BASE_PATH.slice(1)}/${API_VERSION}`; // Убираем ведущий / и добавляем версию
};

/**
 * Полный путь API с версией (для проверки запросов)
 * Всегда: /api/v1
 */
export const getApiPath = (): string => {
  const prefix = getApiPrefix();
  return `/${prefix}`;
};
