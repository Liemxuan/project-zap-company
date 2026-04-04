/**
 * Location Service
 * Handles location data fetching and manipulation with real API (100% no mock)
 */

import { Location, LocationFilter, LocationResponse } from '../models/location.model';
import { 
  getLocationsServer, 
  getLocationByIdServer, 
  createLocationServer, 
  updateLocationServer, 
  deleteLocationServer 
} from './location.server';

/**
 * Fetch all locations with optional filtering (via Server Action)
 */
export async function getLocations(filter?: LocationFilter, page = 1, pageSize = 10): Promise<LocationResponse> {
  return getLocationsServer(filter, page, pageSize);
}

/**
 * Fetch single location by ID (via Server Action)
 */
export async function getLocationById(id: string): Promise<Location | null> {
  return getLocationByIdServer(id);
}

/**
 * Get unique cities derived from the current location list
 */
export async function getLocationCities(): Promise<string[]> {
  try {
    const response = await getLocationsServer({}, 1, 100);
    if (response.success && response.data.items) {
      const cities = new Set(
        response.data.items.map((l) => l.address_json?.split(',').pop()?.trim() || '')
      );
      return Array.from(cities).filter(Boolean).sort();
    }
    return [];
  } catch (error) {
    console.error('[Location Service] Failed to extract cities from API:', error);
    return [];
  }
}

/**
 * Create new location (via Server Action)
 */
export async function createLocation(location: Omit<Location, 'id' | 'created_at' | 'updated_at'>): Promise<Location> {
  return createLocationServer(location);
}

/**
 * Update location (via Server Action)
 */
export async function updateLocation(id: string, updates: Partial<Location>): Promise<Location | null> {
  return updateLocationServer(id, updates);
}

/**
 * Delete location (via Server Action)
 */
export async function deleteLocation(id: string): Promise<boolean> {
  return deleteLocationServer(id);
}

/**
 * Fetch location list using POST (alias for getLocations)
 */
export async function postLocationList(filter?: LocationFilter, page = 1, pageSize = 10): Promise<LocationResponse> {
  return getLocationsServer(filter, page, pageSize);
}
