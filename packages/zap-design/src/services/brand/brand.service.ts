import { API_ENDPOINTS } from '../../const/api';
import { apiService, RequestOptions } from '../common/api.service';
import { 
  BrandListRequest, 
  BrandResponse,
  BrandDetailResponse
} from './brand.model';

export const brandService = {
  async getBrandsList(
    payload: BrandListRequest, 
    options: RequestOptions = {}
  ): Promise<BrandResponse> {
    return apiService.post<BrandResponse>(
      API_ENDPOINTS.BRAND.LIST, 
      payload, 
      options
    );
  },

  async getBrandDetail(
    id: string, 
    options: RequestOptions = {}
  ): Promise<BrandDetailResponse> {
    return apiService.get<BrandDetailResponse>(
      `${API_ENDPOINTS.BRAND.DETAIL}/${id}`, 
      options
    );
  }
};
