"use client";

import { useMutation } from '@tanstack/react-query';
import { apiClient as api } from '@/lib/api/client';

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: any) => {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    },
  });
};

export const useRegister = () => {
    return useMutation({
      mutationFn: async (credentials: any) => {
        const response = await api.post('/auth/register', credentials);
        return response.data;
      },
    });
};
