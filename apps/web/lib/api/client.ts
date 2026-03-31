import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptors for handling auth tokens and global error handling
apiClient.interceptors.request.use(
  (config) => {
    // Inject token if needed
    // const token = localStorage.getItem("auth-token");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle 401s, etc
    return Promise.reject(error);
  }
);
