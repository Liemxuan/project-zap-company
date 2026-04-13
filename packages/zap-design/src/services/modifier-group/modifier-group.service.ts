import { API_ENDPOINTS } from '../../const/api';
import { apiService, RequestOptions } from '../common/api.service';
import { 
  ModifierGroupListRequest, 
  ModifierGroupResponse,
  ModifierGroupDetailResponse
} from './modifier-group.model';

export const modifierGroupService = {
  async getModifierGroupsList(
    payload: ModifierGroupListRequest, 
    options: RequestOptions = {}
  ): Promise<ModifierGroupResponse> {
    return apiService.post<ModifierGroupResponse>(
      API_ENDPOINTS.MODIFIER_GROUP.LIST, 
      payload, 
      options
    );
  },

  async getModifierGroupDetail(
    id: string, 
    options: RequestOptions = {}
  ): Promise<ModifierGroupDetailResponse> {
    return apiService.get<ModifierGroupDetailResponse>(
      `${API_ENDPOINTS.MODIFIER_GROUP.DETAIL}/${id}`, 
      options
    );
  }
};
