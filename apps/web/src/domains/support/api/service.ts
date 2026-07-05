import { apiClient } from '@/shared/api';
import { ApiResponse } from '@/shared/types/api.types';

export interface SupportTicket {
  id: string;
  user_id: string;
  assignee_id?: string;
  subject: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SupportTicketComment {
  id: string;
  ticket_id: string;
  user_id: string;
  body: string;
  is_staff: boolean;
  created_at: string;
}

export interface SupportTicketDetail {
  ticket: SupportTicket;
  comments: SupportTicketComment[];
}

export interface SupportTicketQuery {
  page?: number;
  page_size?: number;
  q?: string;
  status?: string;
  category?: string;
  priority?: string;
  assignee_id?: string;
}

export interface CreateSupportTicketPayload {
  subject: string;
  description?: string;
  category?: string;
  priority?: string;
}

const toQueryString = (query: SupportTicketQuery) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  return params.toString();
};

export const listMySupportTickets = async (
  query: SupportTicketQuery = { page: 1, page_size: 20 }
): Promise<{ items: SupportTicket[]; meta?: ApiResponse<SupportTicket[]>['meta'] }> => {
  const qs = toQueryString(query);
  const response = await apiClient.get<ApiResponse<SupportTicket[]>>(`/support/tickets${qs ? `?${qs}` : ''}`);
  return { items: response.data.data, meta: response.data.meta };
};

export const createSupportTicket = async (payload: CreateSupportTicketPayload): Promise<SupportTicket> => {
  const response = await apiClient.post<ApiResponse<SupportTicket>>('/support/tickets', payload);
  return response.data.data;
};

export const getSupportTicket = async (id: string): Promise<SupportTicketDetail> => {
  const response = await apiClient.get<ApiResponse<SupportTicketDetail>>(`/support/tickets/${id}`);
  return response.data.data;
};

export const addSupportTicketComment = async (id: string, body: string): Promise<SupportTicketComment> => {
  const response = await apiClient.post<ApiResponse<SupportTicketComment>>(`/support/tickets/${id}/comments`, { body });
  return response.data.data;
};

export const listAdminSupportTickets = async (
  query: SupportTicketQuery = { page: 1, page_size: 50 }
): Promise<{ items: SupportTicket[]; meta?: ApiResponse<SupportTicket[]>['meta'] }> => {
  const qs = toQueryString(query);
  const response = await apiClient.get<ApiResponse<SupportTicket[]>>(`/admin/support/tickets${qs ? `?${qs}` : ''}`);
  return { items: response.data.data, meta: response.data.meta };
};

export const getAdminSupportTicket = async (id: string): Promise<SupportTicketDetail> => {
  const response = await apiClient.get<ApiResponse<SupportTicketDetail>>(`/admin/support/tickets/${id}`);
  return response.data.data;
};

export const addAdminSupportTicketComment = async (id: string, body: string): Promise<SupportTicketComment> => {
  const response = await apiClient.post<ApiResponse<SupportTicketComment>>(`/admin/support/tickets/${id}/comments`, { body });
  return response.data.data;
};

export const assignSupportTicket = async (id: string, assigneeId: string): Promise<SupportTicket> => {
  const response = await apiClient.put<ApiResponse<SupportTicket>>(`/admin/support/tickets/${id}/assign`, {
    assignee_id: assigneeId,
  });
  return response.data.data;
};

export const updateSupportTicketStatus = async (id: string, status: string): Promise<SupportTicket> => {
  const response = await apiClient.put<ApiResponse<SupportTicket>>(`/admin/support/tickets/${id}/status`, { status });
  return response.data.data;
};
