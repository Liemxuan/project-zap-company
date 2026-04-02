'use client';

import { useState, useEffect, useCallback } from 'react';
import { Unit, UnitFilter, UnitResponse } from '../models/unit.model';
import { postUnitList } from '../services/unit.service';

export function useUnits(initialPage = 1, pageSize = 10) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<UnitFilter>({});

  // Sync internal page state with initialPage prop when it changes (URL driven)
  useEffect(() => {
    setPage(initialPage);
  }, [initialPage]);

  // Fetch units when filter or page changes
  useEffect(() => {
    const fetchUnits = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await postUnitList(filter, page, pageSize);
        setUnits(response.data);
        setTotal(response.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch units');
        setUnits([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, [filter, page, pageSize]);

  const handleSearch = useCallback((searchQuery: string) => {
    setPage(1);
    setFilter((prev) => ({ ...prev, searchQuery }));
  }, []);

  const handleFilterByStatus = useCallback((status: 'active' | 'inactive' | undefined) => {
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
    units,
    loading,
    error,
    page,
    total,
    pageSize,
    filter,
    handleSearch,
    handleFilterByStatus,
    handlePageChange,
    handleClearFilters,
  };
}
