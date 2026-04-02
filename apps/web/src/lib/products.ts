'use server';

import { apiCallWithAuth } from '@olympus/zap-auth/src/actions';

export interface ProductListRequest {
  page_index: number;
  page_size: number;
  search?: string;
  filters?: Record<string, any>;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  [key: string]: any;
}

export interface ProductListResponse {
  success: boolean;
  data: {
    items: Product[];
    total: number;
    page_index: number;
    page_size: number;
  };
  message?: string;
}

export async function fetchProducts(
  request: ProductListRequest
): Promise<ProductListResponse> {
  try {
    const response = await apiCallWithAuth('/products/list', {
      method: 'POST',
      body: JSON.stringify({
        page_index: request.page_index,
        page_size: request.page_size,
        search: request.search || '',
        filters: request.filters || {},
      }),
    });

    if (!response.ok) {
      console.error('[Products] API error:', response.status);
      return {
        success: false,
        data: {
          items: [],
          total: 0,
          page_index: request.page_index,
          page_size: request.page_size,
        },
        message: `Failed to fetch products: ${response.statusText}`,
      };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('[Products] Error:', error);
    return {
      success: false,
      data: {
        items: [],
        total: 0,
        page_index: request.page_index,
        page_size: request.page_size,
      },
      message: 'Failed to fetch products',
    };
  }
}
