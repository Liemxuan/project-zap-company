/**
 * API Response interface
 * @template T - The type of data returned
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  code: number;
  data: T; // "dynamic" data bằng Generic Type
}

/**
 * Basic request configuration
 */
export interface RequestConfig {
  params?: any;
  headers?: any;
}
