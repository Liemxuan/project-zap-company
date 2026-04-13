import { API_ENDPOINTS } from '../../const/api';
import { apiService, RequestOptions } from '../common/api.service';
import { 
  LocationListRequest, 
  LocationResponse,
  LocationDetailResponse
} from './location.model';

/**
 * Location API Service (Standalone)
 * Handles communications with the CRM Gateway for location-related operations.
 */
export const locationService = {
  /**
   * Fetch location list from the CRM Gateway
   * @param payload - Pagination and filtering options
   * @param options - Request options (lang, token)
   */
  async getLocationsList(
    payload: LocationListRequest, 
    options: RequestOptions = {}
  ): Promise<LocationResponse> {
    return apiService.post<LocationResponse>(
      API_ENDPOINTS.LOCATION.LIST, 
      payload, 
      options
    );
  },

  /**
   * Fetch a single location detail from the CRM Gateway
   * @param id - The location identifier
   * @param options - Request options (lang, token)
   */
  async getLocationsDetail(
    id: string, 
    options: RequestOptions = {}
  ): Promise<LocationDetailResponse> {
    return apiService.get<LocationDetailResponse>(
      `${API_ENDPOINTS.LOCATION.DETAIL}/${id}`, 
      options
    );
  }
};
