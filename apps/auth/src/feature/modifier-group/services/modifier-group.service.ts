/**
 * Modifier Group Service
 * Handles modifier group data fetching and manipulation
 */

import {
  ModifierGroup,
  ModifierGroupFilter,
  ModifierGroupResponse,
} from '../models/modifier-group.model';
import { httpService } from '@/core/api/http.service';
import { API_ENDPOINTS } from '@/const';
import * as modifierGroupMock from '@/mocks/modifier-group.mock';

/**
 * Fetch all modifier groups with optional filtering
 */
export async function getModifierGroups(
  filter?: ModifierGroupFilter,
  page = 1,
  pageSize = 10
): Promise<ModifierGroupResponse> {
  return modifierGroupMock.getMockModifierGroups(filter, page, pageSize);
}

/**
 * Fetch single modifier group by ID
 */
export async function getModifierGroupById(id: string): Promise<ModifierGroup | null> {
  return modifierGroupMock.getMockModifierGroupById(id);
}

/**
 * Fetch modifier group list using POST
 */
export async function postModifierGroupList(
  filter?: ModifierGroupFilter,
  page = 1,
  pageSize = 10
): Promise<ModifierGroupResponse> {
  const mockResult = await getModifierGroups(filter, page, pageSize);

  const response = await httpService.post<ModifierGroupResponse>(
    API_ENDPOINTS.MODIFIER_GROUP_LIST,
    { filter, page, pageSize },
    { success: true, message: 'Success', code: 200, data: mockResult }
  );

  return response.data;
}
