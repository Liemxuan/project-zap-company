/**
 * Product Service
 * Handles product data fetching and manipulation with real API calls (100% no mock)
 */

import { httpService } from '@/core/api/http.service';
import type { ProductFilter, ProductResponse, Product } from '../models/product.model';

const API_BASE_URL = 'https://crm-gateway-v1-c7wqwyi1.uc.gateway.dev/api/products';

/**
 * Fetch all products with optional filtering and pagination
 * @param filter - Filter options (search, category, status, price range)
 * @param page - Page number (1-indexed)
 * @param pageSize - Items per page
 */
export async function getProducts(
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

  console.log('[Product API] Request to /api/products/list:', requestPayload);

  const response = await httpService.post<ProductResponse>(
    `${API_BASE_URL}/list`,
    requestPayload
  );

  console.log('[Product API] Response from /api/products/list:', response);

  return response.data;
}

/**
 * Fetch single product by ID
 * @param id - Product ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  console.log(`[Product API] Request to /api/products/${id}`);

  const response = await httpService.get<Product>(
    `${API_BASE_URL}/${id}`
  );

  console.log(`[Product API] Response from /api/products/${id}:`, response);

  return response.data;
}

/**
 * Fetch product categories
 */
export async function getProductCategories(): Promise<string[]> {
  console.log('[Product API] Request to /api/products/categories');

  const response = await httpService.get<string[]>(
    `${API_BASE_URL}/categories`
  );

  console.log('[Product API] Response from /api/products/categories:', response);

  return response.data;
}

/**
 * Create a new product
 * @param productData - Product data without id and timestamps
 */
export async function createProduct(
  productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Product> {
  console.log('[Product API] Request to /api/products (POST):', productData);

  const response = await httpService.post<Product>(
    `${API_BASE_URL}`,
    productData
  );

  console.log('[Product API] Response from /api/products (POST):', response);

  return response.data;
}

/**
 * Update an existing product
 * @param id - Product ID
 * @param productData - Partial product data to update
 */
export async function updateProduct(
  id: string,
  productData: Partial<Omit<Product, 'id' | 'createdAt'>>
): Promise<Product> {
  console.log(`[Product API] Request to /api/products/${id} (PUT):`, productData);

  const response = await httpService.put<Product>(
    `${API_BASE_URL}/${id}`,
    productData
  );

  console.log(`[Product API] Response from /api/products/${id} (PUT):`, response);

  return response.data;
}

/**
 * Delete a product
 * @param id - Product ID
 */
export async function deleteProduct(id: string): Promise<void> {
  console.log(`[Product API] Request to /api/products/${id} (DELETE)`);

  await httpService.delete<void>(
    `${API_BASE_URL}/${id}`
  );

  console.log(`[Product API] Response from /api/products/${id} (DELETE): Success`);
}
