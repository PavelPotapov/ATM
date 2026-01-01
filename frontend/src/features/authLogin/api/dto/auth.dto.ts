/**
 * @file: auth.dto.ts
 * @description: DTO для аутентификации
 * @created: 2025-01-XX
 */

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    role: string;
  };
}

