'use server';

import type { ProductFilter, ProductResponse, Product } from '../models/product.model';

const API_BASE_URL = 'https://crm-gateway-v1-c7wqwyi1.uc.gateway.dev/api/products';

/**
 * Server action: Fetch all products with optional filtering and pagination
 */
export async function getProductsServer(
  filter?: ProductFilter,
  page = 1,
  pageSize = 10
): Promise<ProductResponse> {
  const requestPayload = {
    page_index: page,
    page_size: pageSize,
    search: filter?.search || '',
    filters: {
      category: filter?.category,
      status: filter?.status,
      minPrice: filter?.minPrice,
      maxPrice: filter?.maxPrice,
    },
  };

  console.log('[Product API] Server Request to /api/products/list:', requestPayload);

  try {
    const response = await fetch(`${API_BASE_URL}/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Product API] Error response:', response.status, errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('[Product API] Server Response from /api/products/list:', data);

    // API returns wrapped response, extract data
    if (data.success && data.data) {
      return data.data;
    }

    return data;
  } catch (error) {
    console.error('[Product API] Server Error fetching products:', error);
    throw error;
  }
}

/**
 * Server action: Fetch single product by ID
 */
export async function getProductByIdServer(id: string): Promise<Product | null> {
  console.log(`[Product API] Server Request to /api/products/${id}`);

  try {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[Product API] Server Response from /api/products/${id}:`, data);

    if (data.success && data.data) {
      return data.data;
    }

    return data;
  } catch (error) {
    console.error(`[Product API] Server Error fetching product ${id}:`, error);
    throw error;
  }
}

/**
 * Server action: Fetch product categories
 */
export async function getProductCategoriesServer(): Promise<string[]> {
  console.log('[Product API] Server Request to /api/products/categories');

  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('[Product API] Server Response from /api/products/categories:', data);

    if (data.success && data.data) {
      return data.data;
    }

    return data;
  } catch (error) {
    console.error('[Product API] Server Error fetching categories:', error);
    throw error;
  }
}
