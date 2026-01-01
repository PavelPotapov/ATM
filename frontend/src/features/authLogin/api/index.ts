/**
 * @file: index.ts
 * @description: Публичный API модуля authLogin
 * @created: 2025-01-XX
 */

export type { LoginDto, AuthResponse } from './dto/auth.dto';
export { login } from './queries/login';
export { useLogin } from './hooks/useLogin';
export { useUser } from './hooks/useUser';
export { authKeys } from './queryKeys';

