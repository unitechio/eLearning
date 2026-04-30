import { apiClient } from '@/shared/services';
import { ApiResponse } from '@/shared/types/api.types';
import { AccessProfile, AuthPayload, LoginInput, RegisterInput, UpdateProfileInput, User } from '../types';

const unwrap = <T>(response: { data: ApiResponse<T> }): T => response.data.data;

export const login = async (credentials: LoginInput): Promise<AuthPayload> => {
  const response = await apiClient.post<ApiResponse<AuthPayload>>('/auth/login', credentials);
  return unwrap(response);
};

export const register = async (payload: RegisterInput): Promise<AuthPayload> => {
  const response = await apiClient.post<ApiResponse<AuthPayload>>('/auth/register', payload);
  return unwrap(response);
};

export const logout = async (): Promise<void> => {
  await apiClient.post<ApiResponse<{ logged_out: boolean }>>('/auth/logout');
};

export const getMe = async (): Promise<User> => {
  const response = await apiClient.get<ApiResponse<User>>('/users/me');
  return unwrap(response);
};

export const updateMe = async (payload: UpdateProfileInput): Promise<User> => {
  const response = await apiClient.put<ApiResponse<User>>('/users/me', payload);
  return unwrap(response);
};

export const getAccessProfile = async (): Promise<AccessProfile> => {
  const response = await apiClient.get<ApiResponse<AccessProfile>>('/authorization/me');
  return unwrap(response);
};
