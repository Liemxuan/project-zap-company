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
  const [filter, setFilter] = useState<LocationFilter>({});

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
        setLocations(response.data);
        setTotal(response.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch locations');
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, [filter, page, pageSize]);

  const handleSearch = useCallback((searchQuery: string) => {
    setPage(1);
    setFilter((prev) => ({ ...prev, searchQuery }));
  }, []);

  const handleFilterByCity = useCallback((city: string | undefined) => {
    setPage(1);
    setFilter((prev) => ({ ...prev, city }));
  }, []);

  const handleFilterByStatus = useCallback((status: 'active' | 'inactive' | 'archived' | undefined) => {
    setPage(1);
    setFilter((prev) => ({ ...prev, status }));
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handleClearFilters = useCallback(() => {
    setPage(1);
    setFilter({});
  }, []);

  return {
    locations,
    cities,
    loading,
    error,
    page,
    total,
    pageSize,
    filter,
    handleSearch,
    handleFilterByCity,
    handleFilterByStatus,
    handlePageChange,
    handleClearFilters,
  };
}
