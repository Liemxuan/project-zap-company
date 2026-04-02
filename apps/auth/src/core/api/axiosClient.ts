/**
 * Axios Base Client
 * Configured with interceptors for authentication and error handling
 */

import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { STORAGE_KEYS } from '@/const';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Only access localStorage on the client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Response Interceptor
axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return only the data from the axios response
    // We cast to any here because we are intentionally narrowing the response
    return response.data as any;
  },
  (error: any) => {
    if (error.response) {
      const { status } = error.response;
      
      // Auto logout on 401 Unauthorized
      if (status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
