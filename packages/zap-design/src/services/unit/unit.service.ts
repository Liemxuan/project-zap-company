import { API_ENDPOINTS } from '../../const/api';
import { apiService, RequestOptions } from '../common/api.service';
import { 
  UnitListRequest, 
  UnitResponse,
  UnitDetailResponse
} from './unit.model';

export const unitService = {
  async getUnitsList(
    payload: UnitListRequest, 
    options: RequestOptions = {}
  ): Promise<UnitResponse> {
    return apiService.post<UnitResponse>(
      API_ENDPOINTS.UNIT.LIST, 
      payload, 
      options
    );
  },

  async getUnitDetail(
    id: string, 
    options: RequestOptions = {}
  ): Promise<UnitDetailResponse> {
    return apiService.get<UnitDetailResponse>(
      `${API_ENDPOINTS.UNIT.DETAIL}/${id}`, 
      options
    );
  }
};
