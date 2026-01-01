/**
 * @file: index.ts
 * @description: Публичный API модуля users
 * @created: 2025-01-XX
 */

// Экспорт типов
export type { UserDto } from './dto/user.dto';
export type { CreateUserDto } from './dto/create-user.dto';

// Экспорт query keys
export { usersKeys } from './queryKeys';

// Экспорт queries (опционально, если нужны напрямую)
export { getUsers } from './queries/getUsers';
export { createUser } from './queries/createUser';
export { deleteUser } from './queries/deleteUser';

// Экспорт hooks (основной способ использования)
export { useUsers } from './hooks/useUsers';
export { useCreateUser } from './hooks/useCreateUser';
export { useDeleteUser } from './hooks/useDeleteUser';

