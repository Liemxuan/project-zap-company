/**
 * DiningOption Service
 * Handles dining option data fetching and manipulation
 */

import { DiningOption, DiningOptionFilter, DiningOptionResponse } from '../models/dining-option.model';
import { httpService } from '@/core/api/http.service';
import { API_ENDPOINTS } from '@/const';
import * as diningOptionMock from '@/mocks/dining-option.mock';

/**
 * Fetch all dining options with optional filtering
 */
export async function getDiningOptions(filter?: DiningOptionFilter, page = 1, pageSize = 10): Promise<DiningOptionResponse> {
  return diningOptionMock.getMockDiningOptions(filter, page, pageSize);
}

/**
 * Fetch single dining option by ID
 */
export async function getDiningOptionById(id: string): Promise<DiningOption | null> {
  return diningOptionMock.getMockDiningOptionById(id);
}

/**
 * Get unique dining option types
 */
export async function getDiningOptionTypes(): Promise<string[]> {
  return diningOptionMock.getMockDiningOptionTypes();
}

/**
 * Create new dining option (mock)
 */
export async function createDiningOption(diningOption: Omit<DiningOption, 'id' | 'createdAt' | 'updatedAt'>): Promise<DiningOption> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const newDiningOption: DiningOption = {
    ...diningOption,
    id: `dining-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  diningOptionMock.MOCK_DINING_OPTIONS.push(newDiningOption);
  return newDiningOption;
}

/**
 * Update dining option (mock)
 */
export async function updateDiningOption(id: string, updates: Partial<DiningOption>): Promise<DiningOption | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const index = diningOptionMock.MOCK_DINING_OPTIONS.findIndex((d) => d.id === id);
  if (index === -1) return null;

  const updated = {
    ...diningOptionMock.MOCK_DINING_OPTIONS[index],
    ...updates,
    updatedAt: new Date(),
  };

  diningOptionMock.MOCK_DINING_OPTIONS[index] = updated;
  return updated;
}

/**
 * Delete dining option (mock)
 */
export async function deleteDiningOption(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const index = diningOptionMock.MOCK_DINING_OPTIONS.findIndex((d) => d.id === id);
  if (index === -1) return false;

  diningOptionMock.MOCK_DINING_OPTIONS.splice(index, 1);
  return true;
}

/**
 * Fetch dining option list using POST
 */
export async function postDiningOptionList(filter?: DiningOptionFilter, page = 1, pageSize = 10): Promise<DiningOptionResponse> {
  const mockResult = await getDiningOptions(filter, page, pageSize);
  
  const response = await httpService.post<DiningOptionResponse>(
    API_ENDPOINTS.DINING_OPTION_LIST, 
    { filter, page, pageSize },
    { success: true, message: 'Success', code: 200, data: mockResult }
  );
  
  return response.data;
}
