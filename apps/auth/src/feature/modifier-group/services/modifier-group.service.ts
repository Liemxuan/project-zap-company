/**
 * Modifier Group Service
 * Handles modifier group data fetching via real API
 */

import {
  ModifierGroupFilter,
  ModifierGroupResponse,
  ModifierGroupApiResponse,
  mapApiItemToModifierGroup,
} from '../models/modifier-group.model';
import { httpService } from '@/core/api/http.service';
import { API_ENDPOINTS } from '@/const';

/**
 * Fetch modifier group list using POST
 * Sends snake_case request body matching API contract
 * 
 * API Response flow:
 * 1. Axios interceptor strips outer axios wrapper → returns { success, data: { items, total, ... } }
 * 2. httpService.post returns this as ApiResponse<T> 
 * 3. So response = { success: true, data: { items, total, total_page, ... } }
 * 4. response.data = { items: [...], total: 50, total_page: 5, ... }
 */
export async function postModifierGroupList(
  filter?: ModifierGroupFilter,
  page = 1,
  pageSize = 10
): Promise<ModifierGroupResponse> {
  // Build request body matching API contract
  const requestBody = {
    page_index: page,
    page_size: pageSize,
    search: filter?.searchQuery || '',
    filters: {},
  };

  const response = await httpService.post<ModifierGroupApiResponse>(
    API_ENDPOINTS.MODIFIER_GROUP_LIST,
    requestBody
  );

  // response.data = { items: [...], total, total_page, total_record, page_index, page_size }
  const apiData = response.data;

  return {
    data: (apiData.items || []).map(mapApiItemToModifierGroup),
    total: apiData.total_record || apiData.total || 0,
    totalPages: apiData.total_page || 1,
    page: apiData.page_index || page,
    pageSize: apiData.page_size || pageSize,
  };
}
