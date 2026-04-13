import { API_ENDPOINTS } from '../../const/api';
import { apiService, RequestOptions } from '../common/api.service';
import { 
  MenuListRequest, 
  MenuResponse,
  MenuDetailResponse
} from './menu.model';

/**
 * Menu API Service
 * Handles communications with the CRM Gateway for menu-related operations.
 */
export const menuService = {
  /**
   * Fetch menu list from the CRM Gateway
   * @param payload - Pagination and filtering options
   * @param options - Request options (lang, token)
   */
  async getMenusList(
    payload: MenuListRequest, 
    options: RequestOptions = {}
  ): Promise<MenuResponse> {
    return apiService.post<MenuResponse>(
      API_ENDPOINTS.MENU.LIST, 
      payload, 
      options
    );
  },

  /**
   * Fetch a single menu detail from the CRM Gateway
   * @param id - The menu identifier
   * @param options - Request options (lang, token)
   */
  async getMenuDetail(
    id: string, 
    options: RequestOptions = {}
  ): Promise<MenuDetailResponse> {
    return apiService.get<MenuDetailResponse>(
      `${API_ENDPOINTS.MENU.DETAIL}/${id}`, 
      options
    );
  }
};
