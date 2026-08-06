import axios from 'axios';

// Dedicated axios instance for the AMS (Access Management System) microservice.
// The base URL is configured via the VITE_AMS_API_URL environment variable.
// Falls back to http://localhost:8080/api/v1 for local development (AMS default port).
export const amsClient = axios.create({
  baseURL: (import.meta.env.VITE_AMS_API_URL as string | undefined) ?? 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Inject Bearer token from localStorage on every request.
// AMS uses its own token (ams_access_token) which falls back to the main app token.
amsClient.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('ams_access_token') ??
    localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response interceptor for 401 handling.
amsClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      localStorage.removeItem('ams_access_token');
    }
    return Promise.reject(err);
  },
);
