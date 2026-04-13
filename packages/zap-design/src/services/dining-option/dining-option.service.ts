import { API_ENDPOINTS } from '../../const/api';
import { apiService, RequestOptions } from '../common/api.service';
import { 
  DiningOptionListRequest, 
  DiningOptionResponse,
  DiningOptionDetailResponse
} from './dining-option.model';

export const diningOptionService = {
  async getDiningOptionsList(
    payload: DiningOptionListRequest, 
    options: RequestOptions = {}
  ): Promise<DiningOptionResponse> {
    return apiService.post<DiningOptionResponse>(
      API_ENDPOINTS.DINING_OPTION.LIST, 
      payload, 
      options
    );
  },

  async getDiningOptionDetail(
    id: string, 
    options: RequestOptions = {}
  ): Promise<DiningOptionDetailResponse> {
    return apiService.get<DiningOptionDetailResponse>(
      `${API_ENDPOINTS.DINING_OPTION.DETAIL}/${id}`, 
      options
    );
  }
};
