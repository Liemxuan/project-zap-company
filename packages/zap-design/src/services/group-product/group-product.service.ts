import { API_ENDPOINTS } from '../../const/api';
import { apiService, RequestOptions } from '../common/api.service';
import { 
  GroupProductListRequest, 
  GroupProductResponse,
  GroupProductDetailResponse
} from './group-product.model';

/**
 * Group Product API Service
 * Handles communications with the CRM Gateway for group product-related operations.
 */
export const groupProductService = {
  /**
   * Fetch group product list from the CRM Gateway
   * @param payload - Pagination and filtering options
   * @param options - Request options (lang, token)
   */
  async getGroupProductsList(
    payload: GroupProductListRequest, 
    options: RequestOptions = {}
  ): Promise<GroupProductResponse> {
    return apiService.post<GroupProductResponse>(
      API_ENDPOINTS.GROUP_PRODUCT.LIST, 
      payload, 
      options
    );
  },

  /**
   * Fetch a single group product detail from the CRM Gateway
   * @param id - The group product identifier
   * @param options - Request options (lang, token)
   */
  async getGroupProductDetail(
    id: string, 
    options: RequestOptions = {}
  ): Promise<GroupProductDetailResponse> {
    return apiService.get<GroupProductDetailResponse>(
      `${API_ENDPOINTS.GROUP_PRODUCT.DETAIL}/${id}`, 
      options
    );
  }
};
