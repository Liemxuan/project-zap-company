/**
 * Product Service
 * Handles product data fetching and manipulation with real API calls (100% no mock)
 */

import { httpService } from '@/core/api/http.service';
import { API_ENDPOINTS } from '@/const';
import type { ProductFilter, ProductResponse, Product } from '../models/product.model';
import type { CategoryResponse } from '../../category/models/category.model';

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

  console.log(`[Product API] Request to ${API_ENDPOINTS.PRODUCT_LIST}:`, requestPayload);

  const response = await httpService.post<ProductResponse>(
    API_ENDPOINTS.PRODUCT_LIST,
    requestPayload
  );

  console.log(`[Product API] Response from ${API_ENDPOINTS.PRODUCT_LIST}:`, response);

  return response.data;
}

/**
 * Fetch single product by ID
 * @param id - Product ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const url = API_ENDPOINTS.PRODUCT_GET.replace(':id', id);
  console.log(`[Product API] Request to ${url}`);

  const response = await httpService.get<Product>(url);

  console.log(`[Product API] Response from ${url}:`, response);

  return response.data;
}

/**
 * Fetch product categories
 */
export async function getProductCategories(): Promise<string[]> {
  const url = API_ENDPOINTS.CATEGORY_LIST;
  console.log(`[Product API] Request to ${url}`);

  const response = await httpService.post<CategoryResponse>(url, { page_index: 1, page_size: 100 });

  console.log(`[Product API] Response from ${url}:`, response);

  if (response.data && response.data.items) {
    return response.data.items.map(cat => cat.name);
  }

  return [];
}

/**
 * Create a new product
 * @param productData - Product data without id and timestamps
 */
export async function createProduct(
  productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Product> {
  const url = API_ENDPOINTS.PRODUCT_CREATE;
  console.log(`[Product API] Request to ${url} (POST):`, productData);

  const response = await httpService.post<Product>(url, productData);

  console.log(`[Product API] Response from ${url} (POST):`, response);

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
  const url = API_ENDPOINTS.PRODUCT_UPDATE.replace(':id', id);
  console.log(`[Product API] Request to ${url} (PUT):`, productData);

  const response = await httpService.put<Product>(url, productData);

  console.log(`[Product API] Response from ${url} (PUT):`, response);

  return response.data;
}

/**
 * Delete a product
 * @param id - Product ID
 */
export async function deleteProduct(id: string): Promise<void> {
  const url = API_ENDPOINTS.PRODUCT_DELETE.replace(':id', id);
  console.log(`[Product API] Request to ${url} (DELETE)`);

  await httpService.delete<void>(url);

  console.log(`[Product API] Response from ${url} (DELETE): Success`);
}
