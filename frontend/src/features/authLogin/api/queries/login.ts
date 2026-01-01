/**
 * @file: login.ts
 * @description: Запрос для входа в систему
 * @dependencies: apiClient, API_ENDPOINTS
 * @created: 2025-01-XX
 */

import { apiClient } from '@/shared/api/axiosClient';
import { API_ENDPOINTS } from '@/shared/config/endpoints.config';
import type { LoginDto, AuthResponse } from '../dto/auth.dto';

/**
 * Вход в систему
 * @param loginDto - email и password
 * @returns access_token, refresh_token и данные пользователя
 */
export const login = async (loginDto: LoginDto): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>(
    API_ENDPOINTS.AUTH.LOGIN,
    loginDto
  );
  return response.data;
};

