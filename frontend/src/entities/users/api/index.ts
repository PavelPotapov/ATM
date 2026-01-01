/**
 * @file: index.ts
 * @description: Публичный API модуля users
 * @created: 2025-01-XX
 */

// Экспорт типов
export type { UserDto } from './dto/user.dto';

// Экспорт query keys
export { usersKeys } from './queryKeys';

// Экспорт queries (опционально, если нужны напрямую)
export { getUsers } from './queries/getUsers';
export { deleteUser } from './queries/deleteUser';

// Экспорт hooks (основной способ использования)
export { useUsers } from './hooks/useUsers';
export { useDeleteUser } from './hooks/useDeleteUser';

