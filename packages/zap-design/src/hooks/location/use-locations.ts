'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  locationService, 
  Location, 
  LocationListRequest, 
  LocationFilters,
  RequestOptions
} from '../../services';

import { MOCK_LOCATIONS } from '../mock-data';

/**
 * Hook to manage Location List data and logic
 * Handles fetching, pagination, and filtering independently.
 */
export function useLocations(
  options: RequestOptions & { initialPage?: number; pageSize?: number } = {}
) {
  const { token, lang = 'en', initialPage = 1, pageSize = 10 } = options;

  // --- State ---
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Current Request Parameters
  const [params, setParams] = useState<LocationListRequest>({
    page_index: initialPage,
    page_size: pageSize,
    search: '',
    filters: {
      status_id: null,
      province_id: null,
      location_type_id: null
    }
  });

  const isMock = process.env.NEXT_PUBLIC_IS_MOCK === 'true';

  // --- Data Fetching ---
  const fetchLocations = useCallback(async (currentParams: LocationListRequest) => {
    setIsLoading(true);
    setError(null);

    if (isMock) {
      // Logic Mock
      await new Promise(resolve => setTimeout(resolve, 500));
      let filtered = [...MOCK_LOCATIONS];
      
      if (currentParams.search) {
        const s = currentParams.search.toLowerCase();
        filtered = filtered.filter(l => 
          l.name.toLowerCase().includes(s) || 
          l.location_code.toLowerCase().includes(s)
        );
      }

      const totalRecord = filtered.length;
      const totalPage = Math.ceil(totalRecord / currentParams.page_size);
      const start = (currentParams.page_index - 1) * currentParams.page_size;
      const items = filtered.slice(start, start + currentParams.page_size);

      setLocations(items);
      setTotalRecords(totalRecord);
      setTotalPages(totalPage);
      setIsLoading(false);
      return;
    }

    try {
      const response = await locationService.getLocationsList(currentParams, { token, lang });
      
      if (response.success) {
        setLocations(response.data.items);
        setTotalRecords(response.data.total_record);
        setTotalPages(response.data.total_page);
      } else {
        setError(response.message || 'Failed to fetch locations');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('[useLocations] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token, lang, isMock]);

  // Trigger fetch when parameters change
  useEffect(() => {
    fetchLocations(params);
  }, [params, fetchLocations]);

  // --- Handlers ---
  
  const handlePageChange = useCallback((page_index: number) => {
    setParams(prev => ({ ...prev, page_index }));
  }, []);

  const handlePageSizeChange = useCallback((page_size: number) => {
    setParams(prev => ({ ...prev, page_size, page_index: 1 }));
  }, []);

  const handleSearch = useCallback((search: string) => {
    setParams(prev => ({ ...prev, search, page_index: 1 }));
  }, []);

  const handleFilterChange = useCallback((filters: Partial<LocationFilters>) => {
    setParams(prev => ({
      ...prev,
      page_index: 1,
      filters: { ...prev.filters, ...filters }
    }));
  }, []);

  const refresh = useCallback(() => {
    fetchLocations(params);
  }, [params, fetchLocations]);

  return {
    // Data & Status
    locations,
    isLoading,
    error,
    
    // Pagination Metadata
    pagination: {
      page_index: params.page_index,
      page_size: params.page_size,
      total_record: totalRecords,
      total_page: totalPages,
    },
    
    // Filters
    search: params.search,
    filters: params.filters,
    
    // Actions
    handlePageChange,
    handlePageSizeChange,
    handleSearch,
    handleFilterChange,
    refresh,
  };
}

/**
 * Hook to manage a single Location Detail
 */
export function useLocationDetail(id: string | null, options: RequestOptions = {}) {
  const { token, lang = 'en' } = options;
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMock = process.env.NEXT_PUBLIC_IS_MOCK === 'true';

  const fetchDetail = useCallback(async (locationId: string) => {
    setIsLoading(true);
    setError(null);

    if (isMock) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const found = MOCK_LOCATIONS.find(l => l.id === locationId);
      if (found) {
        setLocation(found);
      } else {
        setError('Location not found in mock data');
      }
      setIsLoading(false);
      return;
    }

    try {
      const response = await locationService.getLocationsDetail(locationId, { token, lang });
      if (response.success) {
        setLocation(response.data);
      } else {
        setError(response.message || 'Failed to fetch location detail');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('[useLocationDetail] Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token, lang, isMock]);

  useEffect(() => {
    if (id) {
      fetchDetail(id);
    } else {
      setLocation(null);
    }
  }, [id, fetchDetail]);

  return {
    location,
    isLoading,
    error,
    refresh: () => id && fetchDetail(id),
  };
}
