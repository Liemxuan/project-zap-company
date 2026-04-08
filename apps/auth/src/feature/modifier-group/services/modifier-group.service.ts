import {
  ModifierGroupFilter,
  ModifierGroupResponse,
} from '../models/modifier-group.model';
import { getMockModifierGroups } from '../../../mocks/modifier-group.mock';
import { httpService } from '@/core/api/http.service';
import { API_ENDPOINTS } from '@/const';

/**
 * Fetch modifier group list
 */
export async function postModifierGroupList(
  filter?: ModifierGroupFilter,
  page = 1,
  pageSize = 10
): Promise<ModifierGroupResponse> {
  const mockResult = await getMockModifierGroups(filter, page, pageSize);

  const response = await httpService.post<ModifierGroupResponse>(
    API_ENDPOINTS.MODIFIER_GROUP_LIST,
    { filter, page, pageSize },
    { success: true, message: 'Success', code: 200, data: mockResult }
  );

  return response.data;
}

/**
 * Fetch single modifier group by ID
 */
export async function getModifierGroupById(id: string) {
  const mockData = null; // Modifier groups usually don't have a direct get-by-id in this schema
  const url = API_ENDPOINTS.MODIFIER_GROUP_LIST.replace('list', id);
  
  const response = await httpService.get<any>(
    url,
    undefined,
    { success: true, code: 200, message: 'OK', data: mockData }
  );
  return response.data;
}
