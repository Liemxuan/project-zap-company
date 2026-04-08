import { httpService } from '@/core/api/http.service';
import { API_ENDPOINTS } from '@/const';
import type { ProductFilter, ProductResponse, Product } from '../models/product.model';
import type { CategoryResponse } from '../../category/models/category.model';
import { getMockProducts } from '@/mocks/product.mock';

/**
 * Fetch all products with optional filtering and pagination
 */
export async function getProducts(
  filter?: ProductFilter,
  page = 1,
  pageSize = 10
): Promise<ProductResponse> {
  const mockResult = await getMockProducts(filter, page, pageSize);

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

  const response = await httpService.post<ProductResponse>(
    API_ENDPOINTS.PRODUCT_LIST,
    requestPayload,
    { success: true, message: 'Success', code: 200, data: mockResult }
  );

  return response.data;
}

/**
 * Fetch single product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const url = API_ENDPOINTS.PRODUCT_GET.replace(':id', id);
  const response = await httpService.get<Product>(
    url,
    undefined,
    { success: true, code: 200, message: 'OK', data: null as any }
  );
  return response.data;
}

/**
 * Fetch product categories
 */
export async function getProductCategories(): Promise<string[]> {
  const mockCategories = [
    'Electronics', 'Accessories', 'Cables & Adapters', 'Peripherals', 
    'Audio', 'Storage', 'Furniture', 'Food', 'Clothing'
  ];
  const url = API_ENDPOINTS.CATEGORY_LIST;

  const response = await httpService.post<CategoryResponse>(
    url, 
    { page_index: 1, page_size: 100 },
    { success: true, message: 'Success', code: 200, data: { items: [], total_page: 0, total_record: 0, page_index: 1, page_size: 100 } }
  );

  if (response.data && response.data.items && response.data.items.length > 0) {
    return response.data.items.map(cat => cat.name);
  }

  return mockCategories;
}

/**
 * Create a new product
 */
export async function createProduct(
  productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Product> {
  const url = API_ENDPOINTS.PRODUCT_CREATE;
  const response = await httpService.post<Product>(
    url, 
    productData,
    { success: true, message: 'Created', code: 201, data: { ...productData, id: 'new-id' } as any }
  );
  return response.data;
}

/**
 * Update an existing product
 */
export async function updateProduct(
  id: string,
  productData: Partial<Omit<Product, 'id' | 'createdAt'>>
): Promise<Product> {
  const url = API_ENDPOINTS.PRODUCT_UPDATE.replace(':id', id);
  const response = await httpService.put<Product>(
    url, 
    productData,
    { success: true, message: 'Updated', code: 200, data: { id, ...productData } as any }
  );
  return response.data;
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<void> {
  const url = API_ENDPOINTS.PRODUCT_DELETE.replace(':id', id);
  await httpService.delete<void>(
    url,
    undefined,
    { success: true, message: 'Deleted', code: 200, data: undefined as any }
  );
}
