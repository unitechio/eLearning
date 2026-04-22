import { apiClient } from '@/shared/services';
import { AuthResponse } from '../types';

export const login = async (credentials: any): Promise<AuthResponse> => {
  return apiClient.post('/auth/login', credentials);
};

export const register = async (credentials: any): Promise<AuthResponse> => {
  return apiClient.post('/auth/register', credentials);
};
