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
  const mockResult = await unitMock.getMockUnits(filter, page, pageSize);

  const response = await httpService.post<UnitResponse>(
    API_ENDPOINTS.UNIT_LIST,
    { filter, page, pageSize },
    { success: true, message: 'Success', code: 200, data: mockResult }
  );

  return response.data;
}

/**
 * Fetch single unit by ID
 */
export async function getUnitById(id: string): Promise<Unit | null> {
  const mockData = await unitMock.getMockUnitById(id);
  const url = API_ENDPOINTS.UNIT_LIST.replace('list', id);

  const response = await httpService.get<Unit>(
    url,
    undefined,
    { success: true, code: 200, message: 'OK', data: mockData as Unit }
  );
  return response.data;
}

/**
 * Fetch unit list using POST
 */
export async function postUnitList(filter?: UnitFilter, page = 1, pageSize = 10): Promise<UnitResponse> {
  return getUnits(filter, page, pageSize);
}
