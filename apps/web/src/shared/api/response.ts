import type { ApiResponse } from '@/shared/types/api.types';

export function unwrapApiData<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data;
}

export function unwrapApiPage<T>(response: { data: ApiResponse<T[]> }) {
  return {
    items: response.data.data,
    meta: response.data.meta,
    code: response.data.code,
    description: response.data.description,
  };
}
