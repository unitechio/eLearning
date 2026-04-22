/** Base API response envelope */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/** Paginated response envelope */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Common error shape from API */
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}
