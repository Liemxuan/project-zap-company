import { Category, CategoryFilter, CategoryResponse } from '../models/category.model';
import { getMockCategories, getMockCategoryById } from '../../../mocks/category.mock';
import { httpService } from '../../../core/api/http.service';
import { API_ENDPOINTS } from '../../../const';

/**
 * Fetch all categories with optional filtering
 */
export async function getCategories(filter?: CategoryFilter, page = 1, pageSize = 10): Promise<CategoryResponse> {
  const mockResult = await getMockCategories(filter, page, pageSize);
  
  const response = await httpService.post<CategoryResponse>(
    API_ENDPOINTS.CATEGORY_LIST,
    { filter, page, pageSize },
    { success: true, message: 'OK', code: 200, data: mockResult }
  );

  return response.data;
}

/**
 * Fetch single category by ID
 */
export async function getCategoryById(id: string): Promise<Category | null> {
  const url = API_ENDPOINTS.CATEGORY_LIST.replace('list', id);
  const mockData = await getMockCategoryById(id);
  
  const response = await httpService.get<Category>(
    url,
    undefined,
    { success: true, code: 200, message: 'OK', data: mockData as Category }
  );
  return response.data;
}

/**
 * Fetch category list (alias for getCategories)
 */
export async function postCategoryList(filter?: CategoryFilter, page = 1, pageSize = 10): Promise<CategoryResponse> {
  return getCategories(filter, page, pageSize);
}
