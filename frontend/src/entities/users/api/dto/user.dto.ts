/**
 * @file: user.dto.ts
 * @description: DTO для User
 * @created: 2025-01-XX
 */

export interface UserDto {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: 'ADMIN' | 'MANAGER' | 'WORKER';
  createdAt: string;
  updatedAt: string;
}

