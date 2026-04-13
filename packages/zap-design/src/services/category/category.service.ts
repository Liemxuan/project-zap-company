import { API_ENDPOINTS } from '../../const/api';
import { apiService, RequestOptions } from '../common/api.service';
import { 
  CategoryListRequest, 
  CategoryResponse,
  CategoryDetailResponse
} from './category.model';

/**
 * Category API Service
 * Handles communications with the CRM Gateway for category-related operations.
 */
export const categoryService = {
  /**
   * Fetch category list from the CRM Gateway
   * @param payload - Pagination and filtering options
   * @param options - Request options (lang, token)
   */
  async getCategoriesList(
    payload: CategoryListRequest, 
    options: RequestOptions = {}
  ): Promise<CategoryResponse> {
    return apiService.post<CategoryResponse>(
      API_ENDPOINTS.CATEGORY.LIST, 
      payload, 
      options
    );
  },

  /**
   * Fetch a single category detail from the CRM Gateway
   * @param id - The category identifier
   * @param options - Request options (lang, token)
   */
  async getCategoryDetail(
    id: string, 
    options: RequestOptions = {}
  ): Promise<CategoryDetailResponse> {
    return apiService.get<CategoryDetailResponse>(
      `${API_ENDPOINTS.CATEGORY.DETAIL}/${id}`, 
      options
    );
  }
};
