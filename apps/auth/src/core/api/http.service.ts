/**
 * HTTP Service Wrapper
 * Handles switching between Real Axios API and Mock Data based on environment
 */

import axiosClient from './axiosClient';
import { ApiResponse } from './api.types';

const IS_MOCK = process.env.NEXT_PUBLIC_IS_MOCK === 'true';

export const httpService = {
  /**
   * GET Method
   * @template T - Response data type
   */
  async get<T>(url: string, params?: any, mockData?: ApiResponse<T>): Promise<ApiResponse<T>> {
    if (IS_MOCK && mockData) {
      console.log(`%c [MOCK API] GET %c ${url}`, 'color: #3b82f6; font-weight: bold;', 'color: inherit;');
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockData), 800);
      });
    }

    console.log(`%c [REAL API] GET %c ${url}`, 'color: #10b981; font-weight: bold;', 'color: inherit;');
    return axiosClient.get(url, { params });
  },

  /**
   * POST Method
   * @template T - Response data type
   */
  async post<T>(url: string, data?: any, mockData?: ApiResponse<T>): Promise<ApiResponse<T>> {
    if (IS_MOCK && mockData) {
      console.log(`%c [MOCK API] POST %c ${url}`, 'color: #3b82f6; font-weight: bold;', 'color: inherit;');
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockData), 800);
      });
    }

    console.log(`%c [REAL API] POST %c ${url}`, 'color: #10b981; font-weight: bold;', 'color: inherit;');
    return axiosClient.post(url, data);
  },

  /**
   * PUT Method
   * @template T - Response data type
   */
  async put<T>(url: string, data?: any, mockData?: ApiResponse<T>): Promise<ApiResponse<T>> {
    if (IS_MOCK && mockData) {
      console.log(`%c [MOCK API] PUT %c ${url}`, 'color: #3b82f6; font-weight: bold;', 'color: inherit;');
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockData), 800);
      });
    }

    console.log(`%c [REAL API] PUT %c ${url}`, 'color: #10b981; font-weight: bold;', 'color: inherit;');
    return axiosClient.put(url, data);
  },

  /**
   * DELETE Method
   * @template T - Response data type
   */
  async delete<T>(url: string, params?: any, mockData?: ApiResponse<T>): Promise<ApiResponse<T>> {
    if (IS_MOCK && mockData) {
      console.log(`%c [MOCK API] DELETE %c ${url}`, 'color: #3b82f6; font-weight: bold;', 'color: inherit;');
      return new Promise((resolve) => {
        setTimeout(() => resolve(mockData), 800);
      });
    }

    console.log(`%c [REAL API] DELETE %c ${url}`, 'color: #10b981; font-weight: bold;', 'color: inherit;');
    return axiosClient.delete(url, { params });
  },
};
