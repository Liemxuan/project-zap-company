'use client';

import { useState, useEffect, useCallback } from 'react';
import { Location, LocationFilter, LocationResponse } from '../models/location.model';
import { getLocationCities, postLocationList } from '../services/location.service';

export function useLocations(initialPage = 1, pageSize = 10) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filter, setFilter] = useState<LocationFilter>({
    search: '',
    filters: {}
  });

  // Sync internal page state with initialPage prop when it changes (URL driven)
  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);

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

  const handleSearch = useCallback((search: string) => {
    setPage(1);
    setFilter((prev) => ({ ...prev, search }));
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
    setFilter({ search: '', filters: {} });
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
    handlePageChange,
    handleClearFilters,
  };
}
