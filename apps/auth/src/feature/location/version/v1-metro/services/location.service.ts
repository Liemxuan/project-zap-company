import { Location, LocationFilter, LocationResponse } from '../models/location.model';
import { 
  getMockLocations, 
  getMockLocationById, 
  getMockLocationCities 
} from '../../../mocks/location.mock';
import { httpService } from '../../../core/api/http.service';
import { API_ENDPOINTS } from '../../../const';

/**
 * Fetch all locations with optional filtering
 */
export async function getLocations(filter?: LocationFilter, page = 1, pageSize = 10): Promise<LocationResponse> {
  // Payload structure must match the backend specification exactly
  const payload = {
    page_index: page,
    page_size: pageSize,
    search: typeof filter?.search === 'string' ? filter.search : filter?.search?.value || '',
    filters: {
      status_id: filter?.filters?.status_id ?? null,
      province_id: filter?.filters?.province_id ?? null,
      location_type_id: filter?.filters?.location_type_id || [], // Reverted as per user request
    }
  };

  const response = await httpService.post<LocationResponse['data']>(
    API_ENDPOINTS.LOCATION_LIST,
    payload
  );

  return {
    success: response.success,
    code: response.code,
    message: response.message,
    data: response.data
  };
}

/**
 * Fetch single location by ID
 */
export async function getLocationById(id: string): Promise<Location | null> {
  const url = `${API_ENDPOINTS.LOCATION_LIST.replace('/list', '')}/${id}`;
  const response = await httpService.get<Location>(url);
  return response.data;
}

/**
 * Get unique cities
 */
export async function getLocationCities(): Promise<string[]> {
  try {
    const response = await httpService.get<string[]>('/locations/cities');
    return response.data;
  } catch (error) {
    console.warn('[LOCATION SERVICE] Real API Error for cities:', error);
    return [];
  }
}

/**
 * Create new location
 */
export async function createLocation(location: Omit<Location, 'id' | 'created_at' | 'updated_at'>): Promise<Location> {
  const url = API_ENDPOINTS.LOCATION_LIST.replace('/list', '');
  const response = await httpService.post<Location>(url, location);
  return response.data;
}

/**
 * Update location
 */
export async function updateLocation(id: string, updates: Partial<Location>): Promise<Location | null> {
  const url = `${API_ENDPOINTS.LOCATION_LIST.replace('/list', '')}/${id}`;
  const response = await httpService.put<Location>(url, updates);
  return response.data;
}

/**
 * Delete location
 */
export async function deleteLocation(id: string): Promise<boolean> {
  const url = `${API_ENDPOINTS.LOCATION_LIST.replace('/list', '')}/${id}`;
  const response = await httpService.delete<null>(url);
  return response.success;
}

/**
 * Fetch location list using POST
 */
export async function postLocationList(filter?: LocationFilter, page = 1, pageSize = 10): Promise<LocationResponse> {
  return getLocations(filter, page, pageSize);
}
