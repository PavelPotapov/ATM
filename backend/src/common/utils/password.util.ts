/**
 * @file: password.util.ts
 * @description: Утилиты для работы с паролями - хэширование и проверка
 * @dependencies: bcrypt
 * @created: 2025-12-07
 */

import * as bcrypt from 'bcrypt';

/**
 * Хэширует пароль перед сохранением в БД
 *
 * @param password - пароль в открытом виде
 * @returns хэшированный пароль
 *
 * @example
 * const hashedPassword = await hashPassword('myPassword123');
 */
export async function hashPassword(password: string): Promise<string> {
  // saltRounds = 10 - количество раундов хэширования (баланс между безопасностью и скоростью)
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Сравнивает пароль с хэшем
 *
 * @param password - пароль в открытом виде
 * @param hash - хэш из БД
 * @returns true, если пароль совпадает с хэшем
 *
 * @example
 * const isValid = await comparePassword('myPassword123', hashedPassword);
 */
export async function comparePassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
