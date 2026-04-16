import { API_ENDPOINTS } from '../../const/api';
import { apiService, RequestOptions } from '../common/api.service';
import { 
  CollectionListRequest, 
  CollectionResponse,
  CollectionDetailResponse
} from './collection.model';
import { MOCK_COLLECTIONS } from '@/hooks/mock-data';

const isMock = process.env.NEXT_PUBLIC_IS_MOCK === 'true';

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
    if (isMock) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let filtered = [...MOCK_COLLECTIONS];
      
      if (payload.search) {
        const searchLower = payload.search.toLowerCase();
        filtered = filtered.filter(c => 
          c.name.toLowerCase().includes(searchLower) || 
          c.id.toString().includes(searchLower)
        );
      }

      const total_record = filtered.length;
      const total_page = Math.ceil(total_record / payload.page_size);
      const start = (payload.page_index - 1) * payload.page_size;
      const items = filtered.slice(start, start + payload.page_size);

      return {
        success: true,
        data: { items, total_record, total_page, page_index: payload.page_index, page_size: payload.page_size }
      };
    }

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
    if (isMock) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const collection = MOCK_COLLECTIONS.find(c => c.id === id);
      if (!collection) throw new Error('Collection not found');
      return {
        success: true,
        data: collection
      };
    }

    return apiService.get<CollectionDetailResponse>(
      `${API_ENDPOINTS.COLLECTION.DETAIL}/${id}`, 
      options
    );
  }
};
