import { apiService, RequestOptions } from '../common/api.service';
import { API_ENDPOINTS } from '../../const/api';
import { 
  ModifierItemListRequest, 
  ModifierItemResponse,
  ModifierItemDetailResponse
} from './modifier-item.model';

/**
 * Service to handle Modifier Item related API calls
 * Handles communication with the CRM Gateway for modifier item operations.
 */
export const modifierItemService = {
  /**
   * Get list of modifier items with pagination and filters
   * @param params - Pagination and filtering options
   * @param options - Request options (lang, token)
   */
  getModifierItemsList: async (
    params: ModifierItemListRequest,
    options: RequestOptions = {}
  ): Promise<ModifierItemResponse> => {
    return apiService.post<ModifierItemResponse>(
      API_ENDPOINTS.MODIFIER_ITEM.LIST,
      params,
      options
    );
  },

  /**
   * Get specific modifier item detail by ID
   * @param id - The modifier item identifier
   * @param options - Request options (lang, token)
   */
  getModifierItemDetail: async (
    id: string,
    options: RequestOptions = {}
  ): Promise<ModifierItemDetailResponse> => {
    return apiService.get<ModifierItemDetailResponse>(
      `${API_ENDPOINTS.MODIFIER_ITEM.DETAIL}/${id}`,
      options
    );
  },
};
