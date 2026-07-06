import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as usersService from './service';

export const useAdminUsers = (query: usersService.AdminUserQuery) =>
  useQuery({
    queryKey: ['admin', 'users', query],
    queryFn: () => usersService.listAdminUsers(query),
  });

export const useUpdateAdminUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => usersService.updateAdminUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
    },
  });
};

export const useAdminRoles = () =>
  useQuery({
    queryKey: ['admin', 'roles'],
    queryFn: usersService.listAdminRoles,
  });

export const useAdminPermissions = () =>
  useQuery({
    queryKey: ['admin', 'permissions'],
    queryFn: usersService.listAdminPermissions,
  });
