/**
 * @file: user.types.ts
 * @description: Типы для пользователя
 * @dependencies: @prisma/client
 * @created: 2025-12-07
 */

import { Role } from '@prisma/client';

/**
 * BaseUser - базовый тип с общими полями пользователя
 */
interface BaseUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: Role;
}

/**
 * UserWithTimestamps - пользователь с временными метками
 */
export interface UserWithTimestamps extends BaseUser {
  createdAt: Date;
  updatedAt: Date;
}

/**
 * AuthenticatedUser - тип пользователя после успешной аутентификации
 * Соответствует данным, возвращаемым из JwtStrategy.validate()
 * и используемым в @CurrentUser() декораторе
 */
export type AuthenticatedUser = BaseUser;

/**
 * UserWithoutPassword - пользователь без пароля (для безопасного возврата из API)
 */
export type UserWithoutPassword = UserWithTimestamps;

/**
 * UserWithPassword - пользователь с паролем (только для внутреннего использования)
 */
export interface UserWithPassword extends UserWithTimestamps {
  password: string;
}
