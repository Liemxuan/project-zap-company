/**
 * Location Service
 * Handles location data fetching and manipulation
 */

import { Location, LocationFilter, LocationResponse } from '../models/location.model';
import { httpService } from '@/core/api/http.service';
import { API_ENDPOINTS } from '@/const';
import * as locationMock from '@/mocks/location.mock';

/**
 * Fetch all locations with optional filtering
 */
export async function getLocations(filter?: LocationFilter, page = 1, pageSize = 10): Promise<LocationResponse> {
  return locationMock.getMockLocations(filter, page, pageSize);
}

/**
 * Fetch single location by ID
 */
export async function getLocationById(id: string): Promise<Location | null> {
  return locationMock.getMockLocationById(id);
}

/**
 * Get unique cities
 */
export async function getLocationCities(): Promise<string[]> {
  return locationMock.getMockLocationCities();
}

/**
 * Create new location (mock)
 */
export async function createLocation(location: Omit<Location, 'id' | 'createdAt' | 'updatedAt'>): Promise<Location> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const newLocation: Location = {
    ...location,
    id: `loc-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  locationMock.MOCK_LOCATIONS.push(newLocation);
  return newLocation;
}

/**
 * Update location (mock)
 */
export async function updateLocation(id: string, updates: Partial<Location>): Promise<Location | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const index = locationMock.MOCK_LOCATIONS.findIndex((l) => l.id === id);
  if (index === -1) return null;

  const updated = {
    ...locationMock.MOCK_LOCATIONS[index],
    ...updates,
    updatedAt: new Date(),
  };

  locationMock.MOCK_LOCATIONS[index] = updated;
  return updated;
}

/**
 * Delete location (mock)
 */
export async function deleteLocation(id: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const index = locationMock.MOCK_LOCATIONS.findIndex((l) => l.id === id);
  if (index === -1) return false;

  locationMock.MOCK_LOCATIONS.splice(index, 1);
  return true;
}

/**
 * Fetch location list using POST
 */
export async function postLocationList(filter?: LocationFilter, page = 1, pageSize = 10): Promise<LocationResponse> {
  const mockResult = await getLocations(filter, page, pageSize);
  
  const response = await httpService.post<LocationResponse>(
    API_ENDPOINTS.LOCATION_LIST, 
    { filter, page, pageSize },
    { success: true, message: 'Success', code: 200, data: mockResult }
  );
  
  return response.data;
}
