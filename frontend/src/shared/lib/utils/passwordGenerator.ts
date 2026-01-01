/**
 * @file: passwordGenerator.ts
 * @description: Утилита для генерации паролей
 * @created: 2025-01-XX
 */

/**
 * Генерирует случайный пароль заданной длины
 * @param length - длина пароля (по умолчанию 12)
 * @returns сгенерированный пароль
 */
export function generatePassword(length: number = 12): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = lowercase + uppercase + numbers + symbols;
  
  // Гарантируем, что пароль содержит хотя бы по одному символу каждого типа
  let password = '';
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Заполняем остальную часть пароля случайными символами
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Перемешиваем символы для случайного порядка
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}
