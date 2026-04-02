/**
 * Unit Service
 * Handles unit data fetching and manipulation
 */

import { Unit, UnitFilter, UnitResponse } from '../models/unit.model';
import { httpService } from '@/core/api/http.service';
import { API_ENDPOINTS } from '@/const';
import * as unitMock from '@/mocks/unit.mock';

/**
 * Fetch all units with optional filtering
 */
export async function getUnits(filter?: UnitFilter, page = 1, pageSize = 10): Promise<UnitResponse> {
  return unitMock.getMockUnits(filter, page, pageSize);
}

/**
 * Fetch single unit by ID
 */
export async function getUnitById(id: string): Promise<Unit | null> {
  return unitMock.getMockUnitById(id);
}

/**
 * Fetch unit list using POST
 */
export async function postUnitList(filter?: UnitFilter, page = 1, pageSize = 10): Promise<UnitResponse> {
  const mockResult = await getUnits(filter, page, pageSize);

  const response = await httpService.post<UnitResponse>(
    API_ENDPOINTS.UNIT_LIST,
    { filter, page, pageSize },
    { success: true, message: 'Success', code: 200, data: mockResult }
  );

  return response.data;
}
