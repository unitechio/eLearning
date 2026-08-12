import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { Document, Folder, DocumentVersion, DocumentPermission, DocumentActivity, DocumentStats } from '../types';

export function useDocuments(filters: {
  folder_id?: number | 'null';
  status?: string;
  visibility?: string;
  mime_type?: string;
  search?: string;
  is_favorite?: boolean;
  limit?: number;
  offset?: number;
  sort_by?: string;
  start_date?: string;
  end_date?: string;
}) {
  return useQuery({
    queryKey: ['documents', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.folder_id !== undefined && filters.folder_id !== null) {
        params.append('folder_id', filters.folder_id.toString());
      }
      if (filters.status) params.append('status', filters.status);
      if (filters.visibility) params.append('visibility', filters.visibility);
      if (filters.mime_type) params.append('mime_type', filters.mime_type);
      if (filters.search) params.append('search', filters.search);
      if (filters.is_favorite !== undefined) params.append('is_favorite', filters.is_favorite.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());
      if (filters.sort_by) params.append('sort_by', filters.sort_by);
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);

      const res = await apiClient.get<{ data: { items: Document[]; total: number } }>(
        `/admin/documents?${params.toString()}`
      );
      return res.data.data;
    },
  });
}

export function useDocument(id?: number) {
  return useQuery({
    queryKey: ['document', id],
    queryFn: async () => {
      if (!id) return null;
      const res = await apiClient.get<{ data: Document }>(`/admin/documents/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useDocumentStats() {
  return useQuery({
    queryKey: ['document-stats'],
    queryFn: async () => {
      const res = await apiClient.get<{ data: DocumentStats }>('/admin/documents/stats');
      return res.data.data;
    },
  });
}

export function useFolders(parentID?: number) {
  return useQuery({
    queryKey: ['folders', parentID],
    queryFn: async () => {
      const url = parentID ? `/admin/documents/folders?parent_id=${parentID}` : '/admin/documents/folders';
      const res = await apiClient.get<{ data: Folder[] }>(url);
      return res.data.data;
    },
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; parent_id?: number }) => {
      const res = await apiClient.post<{ data: Folder }>('/admin/documents/folders', data);
      return res.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
}

export function useUpdateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: number; name: string; parent_id?: number }) => {
      const res = await apiClient.patch<{ data: Folder }>(`/admin/documents/folders/${data.id}`, {
        name: data.name,
        parent_id: data.parent_id,
      });
      return res.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/admin/documents/folders/${id}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await apiClient.post<{ data: Document }>('/admin/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['documents'] });
      void queryClient.invalidateQueries({ queryKey: ['document-stats'] });
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: number;
      title: string;
      description?: string;
      folder_id?: number;
      visibility?: string;
      is_favorite?: boolean;
    }) => {
      const res = await apiClient.patch<{ data: Document }>(`/admin/documents/${data.id}`, data);
      return res.data.data;
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ['document', data.id] });
      void queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/admin/documents/${id}`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useRestoreDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.post(`/admin/documents/${id}/restore`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function usePermanentDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/admin/documents/${id}/permanent`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useUploadVersion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, formData }: { id: number; formData: FormData }) => {
      const res = await apiClient.post<{ data: DocumentVersion }>(
        `/admin/documents/${id}/versions`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return res.data.data;
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ['document', data.document_id] });
      void queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useGetVersions(docID?: number) {
  return useQuery({
    queryKey: ['document-versions', docID],
    queryFn: async () => {
      if (!docID) return [];
      const res = await apiClient.get<{ data: DocumentVersion[] }>(`/admin/documents/${docID}/versions`);
      return res.data.data;
    },
    enabled: !!docID,
  });
}

export function useShareDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      id: number;
      subject_type: 'user' | 'role';
      subject_id: string;
      permission: 'viewer' | 'editor';
    }) => {
      const res = await apiClient.post<{ data: DocumentPermission }>(
        `/admin/documents/${data.id}/share`,
        data
      );
      return res.data.data;
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ['document-permissions', data.document_id] });
    },
  });
}

export function useRevokePermission() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ docID, permID }: { docID: number; permID: number }) => {
      await apiClient.delete(`/admin/documents/${docID}/permissions/${permID}`);
    },
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: ['document-permissions', variables.docID] });
    },
  });
}

export function useGetPermissions(docID?: number) {
  return useQuery({
    queryKey: ['document-permissions', docID],
    queryFn: async () => {
      if (!docID) return [];
      const res = await apiClient.get<{ data: DocumentPermission[] }>(`/admin/documents/${docID}/permissions`);
      return res.data.data;
    },
    enabled: !!docID,
  });
}

export function useGetActivity(docID?: number) {
  return useQuery({
    queryKey: ['document-activity', docID],
    queryFn: async () => {
      if (!docID) return [];
      const res = await apiClient.get<{ data: DocumentActivity[] }>(`/admin/documents/${docID}/activity`);
      return res.data.data;
    },
    enabled: !!docID,
  });
}

export function useFavoriteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.post(`/admin/documents/${id}/favorite`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useUnfavoriteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/admin/documents/${id}/favorite`);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

export function useAttachToResource() {
  return useMutation({
    mutationFn: async (data: { id: number; resource_type: string; resource_id: number }) => {
      await apiClient.post(`/admin/documents/${data.id}/attachments`, data);
    },
  });
}

export function useDetachFromResource() {
  return useMutation({
    mutationFn: async (data: { id: number; resource_type: string; resource_id: number }) => {
      await apiClient.delete(
        `/admin/documents/${data.id}/attachments?resource_type=${data.resource_type}&resource_id=${data.resource_id}`
      );
    },
  });
}
