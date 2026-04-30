/** Base API response envelope */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: {
    code: number;
    message: string;
    fields?: Record<string, string>;
  };
  meta?: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
  };
  request_id?: string;
}

/** Common error shape from API */
export interface ApiError {
  message: string;
  code?: string | number;
  statusCode?: number;
  fields?: Record<string, string>;
}
