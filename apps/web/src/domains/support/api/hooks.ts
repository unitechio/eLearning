import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addAdminSupportTicketComment,
  addSupportTicketComment,
  assignSupportTicket,
  createSupportTicket,
  getAdminSupportTicket,
  getSupportTicket,
  listAdminSupportTickets,
  listMySupportTickets,
  SupportTicketQuery,
  updateSupportTicketStatus,
} from './service';

export const useMySupportTickets = (query: SupportTicketQuery = { page: 1, page_size: 20 }) =>
  useQuery({
    queryKey: ['support', 'tickets', query],
    queryFn: () => listMySupportTickets(query),
  });

export const useSupportTicket = (id: string) =>
  useQuery({
    queryKey: ['support', 'tickets', id],
    queryFn: () => getSupportTicket(id),
    enabled: Boolean(id),
  });

export const useCreateSupportTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSupportTicket,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['support', 'tickets'] }),
  });
};

export const useAddSupportTicketComment = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => addSupportTicketComment(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support', 'tickets', id] });
      queryClient.invalidateQueries({ queryKey: ['support', 'tickets'] });
    },
  });
};

export const useAdminSupportTickets = (query: SupportTicketQuery = { page: 1, page_size: 50 }) =>
  useQuery({
    queryKey: ['admin', 'support', 'tickets', query],
    queryFn: () => listAdminSupportTickets(query),
  });

export const useAdminSupportTicket = (id: string) =>
  useQuery({
    queryKey: ['admin', 'support', 'tickets', id],
    queryFn: () => getAdminSupportTicket(id),
    enabled: Boolean(id),
  });

export const useAddAdminSupportTicketComment = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: string) => addAdminSupportTicketComment(id, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'support', 'tickets'] }),
  });
};

export const useAssignSupportTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, assigneeId }: { id: string; assigneeId: string }) => assignSupportTicket(id, assigneeId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'support', 'tickets'] }),
  });
};

export const useUpdateSupportTicketStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateSupportTicketStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'support', 'tickets'] }),
  });
};
