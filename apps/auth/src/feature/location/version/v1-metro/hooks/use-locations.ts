'use client';

import { useState, useEffect, useCallback } from 'react';
import { Location, LocationFilter, LocationResponse } from '../models/location.model';
import { deleteLocation, getLocationCities, postLocationList } from '../services/location.service';

export function useLocations(initialPage = 1, pageSize = 10, initialFilter?: LocationFilter) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState<LocationFilter>(initialFilter || {
    search: { value: '', column: 'name' },
    filters: {
      status_id: null,
      province_id: null,
      location_type_id: []
    },
    sort: {
      field: 'name',
      descending: false
    }
  });

  const handleSort = useCallback((field: string, descending: boolean) => {
    setFilter(prev => ({
      ...prev,
      sort: { field, descending }
    }));
  }, []);


  // Sync internal page state with initialPage prop when it changes (URL driven)
  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);

  // Sync internal filter state with initialFilter prop when it changes
  useEffect(() => {
    if (initialFilter) {
      setFilter(initialFilter);
    }
  }, [initialFilter]);

  // Fetch cities on mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const c = await getLocationCities();
        setCities(c);
      } catch (err) {
        console.error('Failed to fetch cities:', err);
      }
    };
    fetchCities();
  }, []);

  // Fetch locations when filter or page changes
  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await postLocationList(filter, page, pageSize);
        if (response.success) {
          setLocations(response.data.items);
          setTotal(response.data.total_record);
          setTotalPages(response.data.total_page);
        } else {
          setError(response.message || 'Failed to fetch locations');
          setLocations([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch locations');
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [filter, page, pageSize]);

  const handleSearch = useCallback((value: string) => {
    setPage(1);
    setFilter((prev) => ({ 
      ...prev, 
      search: { value, column: 'name' }
    }));
  }, []);

  const handleFilterByWarehouseType = useCallback((warehouse_type: string[] | undefined) => {
    setPage(1);
    setFilter((prev) => ({ 
      ...prev, 
      filters: { ...prev.filters, warehouse_type } 
    }));
  }, []);

  const handleFilterByStatus = useCallback((is_active: boolean[] | undefined) => {
    setPage(1);
    setFilter((prev) => ({ 
      ...prev, 
      filters: { ...prev.filters, is_active } 
    }));
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleClearFilters = useCallback(() => {
    setPage(1);
    setFilter({ 
      search: { value: '', column: 'name' }, 
      filters: {
        status_id: null,
        province_id: null,
        location_type_id: []
      },
      sort: {
        field: 'name',
        descending: false
      }
    });
  }, []);

  const handleDeleteLocation = useCallback(async (id: string) => {
    if (!id) return;
    try {
      setLoading(true);
      const success = await deleteLocation(id);
      if (success) {
        // Refresh local list
        setLocations((prev) => prev.filter(loc => loc.id !== id));
        setTotal(t => t - 1);
      } else {
        setError('Failed to delete location');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting location');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    locations,
    cities,
    loading,
    error,
    page,
    total,
    totalRecords: total,
    totalPages,
    pageSize,
    filter,
    handleSearch,
    handleFilterByWarehouseType,
    handleFilterByStatus,
    handleSort,
    handlePageChange,
    handleClearFilters,
    handleDeleteLocation,
  };
}
