import { useMutation, useQuery } from '@tanstack/react-query';
import * as authService from './service';

export const useLogin = () => {
  return useMutation({
    mutationFn: authService.login,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authService.register,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: authService.logout,
  });
};

export const useMe = (enabled = true) => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authService.getMe,
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};

export const useAccessProfile = (enabled = true) => {
  return useQuery({
    queryKey: ['auth', 'access-profile'],
    queryFn: authService.getAccessProfile,
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: authService.updateMe,
  });
};
