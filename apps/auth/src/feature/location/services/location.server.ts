'use server';

import type { Location, LocationFilter, LocationResponse } from '../models/location.model';
import { API_BASE_URL, API_ENDPOINTS, IS_MOCK } from '@/const';
import { LocationListMock } from '@/mocks/api/location/list';
import { LocationDetailMock } from '@/mocks/api/location/detail';

/**
 * Server action: Fetch all locations with optional filtering and pagination
 */
export async function getLocationsServer(
  filter?: LocationFilter,
  page = 1,
  pageSize = 10
): Promise<LocationResponse> {
  const requestPayload = {
    page_index: page,
    page_size: pageSize,
    search: filter?.search || '',
    filters: filter?.filters || {},
  };

  if (IS_MOCK) {
    console.log('[Location API] [MOCK] Returning paginated mock data');
    const mockResponse = LocationListMock.paginate(page, pageSize) as unknown as LocationResponse;
    return mockResponse;
  }

  console.log(`[Location API] Server Request to ${API_ENDPOINTS.LOCATION_LIST}:`, requestPayload);

  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOCATION_LIST}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Location API] Error response:', response.status, errorText);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`[Location API] Server Response from ${API_ENDPOINTS.LOCATION_LIST}:`, data);

    if (data.success && data.data) {
      return data;
    }

    return {
      success: false,
      code: 200,
      message: 'Empty result',
      data: {
        items: [],
        total_page: 0,
        total_record: 0,
        page_index: page,
        page_size: pageSize
      }
    } as LocationResponse;
  } catch (error) {
    console.error('[Location API] Server Error fetching locations:', error);
    throw error;
  }
}

/**
 * Server action: Fetch single location by ID
 */
export async function getLocationByIdServer(id: string): Promise<Location | null> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.LOCATION_LIST.replace('/list', '')}/${id}`;
  
  if (IS_MOCK) {
    console.log('[Location API] [MOCK] Returning single mock item for ID:', id);
    const mockResponse = LocationDetailMock.get(id) as any;
    return mockResponse.success ? mockResponse.data : null;
  }

  console.log(`[Location API] GET Request to ${url}`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) return null;
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('[Location API] Error fetching location by ID:', error);
    return null;
  }
}

/**
 * Server action: Create new location
 */
export async function createLocationServer(location: Omit<Location, 'id' | 'created_at' | 'updated_at'>): Promise<Location> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.LOCATION_LIST.replace('/list', '')}`;
  console.log(`[Location API] POST Request to ${url}:`, location);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(location),
    });

    const data = await response.json();
    if (data.success && data.data) return data.data;
    throw new Error(data.message || 'Failed to create location');
  } catch (error) {
    console.error('[Location API] Error creating location:', error);
    throw error;
  }
}

/**
 * Server action: Update location
 */
export async function updateLocationServer(id: string, updates: Partial<Location>): Promise<Location | null> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.LOCATION_LIST.replace('/list', '')}/${id}`;
  console.log(`[Location API] PUT Request to ${url}:`, updates);

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('[Location API] Error updating location:', error);
    return null;
  }
}

/**
 * Server action: Delete location
 */
export async function deleteLocationServer(id: string): Promise<boolean> {
  const url = `${API_BASE_URL}${API_ENDPOINTS.LOCATION_LIST.replace('/list', '')}/${id}`;
  console.log(`[Location API] DELETE Request to ${url}`);

  try {
    const response = await fetch(url, {
      method: 'DELETE',
    });

    const data = await response.json();
    return !!data.success;
  } catch (error) {
    console.error('[Location API] Error deleting location:', error);
    return false;
  }
}
