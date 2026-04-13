import { API_ENDPOINTS } from '../../const/api';
import { apiService, RequestOptions } from '../common/api.service';
import { 
  CollectionListRequest, 
  CollectionResponse,
  CollectionDetailResponse
} from './collection.model';

/**
 * Collection API Service
 * Handles communications with the CRM Gateway for collection-related operations.
 */
export const collectionService = {
  /**
   * Fetch collection list from the CRM Gateway
   * @param payload - Pagination and filtering options
   * @param options - Request options (lang, token)
   */
  async getCollectionsList(
    payload: CollectionListRequest, 
    options: RequestOptions = {}
  ): Promise<CollectionResponse> {
    return apiService.post<CollectionResponse>(
      API_ENDPOINTS.COLLECTION.LIST, 
      payload, 
      options
    );
  },

  /**
   * Fetch a single collection detail from the CRM Gateway
   * @param id - The collection identifier
   * @param options - Request options (lang, token)
   */
  async getCollectionDetail(
    id: string, 
    options: RequestOptions = {}
  ): Promise<CollectionDetailResponse> {
    return apiService.get<CollectionDetailResponse>(
      `${API_ENDPOINTS.COLLECTION.DETAIL}/${id}`, 
      options
    );
  }
};
