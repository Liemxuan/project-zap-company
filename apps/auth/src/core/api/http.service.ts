/**
 * HTTP Service Wrapper
 * Handles switching between Real Axios API and Mock Data based on environment
 */

import axiosClient from './axiosClient';
import { ApiResponse } from './api.types';
import { IS_MOCK } from '@/const';

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
    try {
      return await axiosClient.get(url, { params });
    } catch (error) {
      if (mockData) {
        console.warn(`%c [API FALLBACK] GET %c ${url} failed, using mock data`, 'color: #f59e0b; font-weight: bold;', 'color: inherit;', error);
        return mockData;
      }
      throw error;
    }
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
    try {
      return await axiosClient.post(url, data);
    } catch (error) {
      if (mockData) {
        console.warn(`%c [API FALLBACK] POST %c ${url} failed, using mock data`, 'color: #f59e0b; font-weight: bold;', 'color: inherit;', error);
        return mockData;
      }
      throw error;
    }
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
    try {
      return await axiosClient.put(url, data);
    } catch (error) {
      if (mockData) {
        console.warn(`%c [API FALLBACK] PUT %c ${url} failed, using mock data`, 'color: #f59e0b; font-weight: bold;', 'color: inherit;', error);
        return mockData;
      }
      throw error;
    }
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
    try {
      return await axiosClient.delete(url, { params });
    } catch (error) {
      if (mockData) {
        console.warn(`%c [API FALLBACK] DELETE %c ${url} failed, using mock data`, 'color: #f59e0b; font-weight: bold;', 'color: inherit;', error);
        return mockData;
      }
      throw error;
    }
  },
};
